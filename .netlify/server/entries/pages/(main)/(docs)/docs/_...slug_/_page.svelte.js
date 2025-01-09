import { c as create_ssr_component, v as validate_component, h as each, e as escape } from "../../../../../../chunks/ssr.js";
import "diff";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { g as getDrawerStore, D as Drawer } from "../../../../../../chunks/Drawer.js";
function areEqualSets(a, b) {
  if (a.size !== b.size)
    return false;
  const aClone = new Set(a);
  const bClone = new Set(b);
  for (const elem of aClone) {
    bClone.add(elem);
    if (bClone.size !== b.size)
      return false;
  }
  for (const elem of bClone) {
    aClone.add(elem);
    if (aClone.size !== a.size)
      return false;
  }
  return true;
}
function mergeDefaultInterface(partial, def) {
  if (!partial)
    return def;
  const final = { ...def };
  Object.entries(partial).forEach(([key, value]) => {
    final[key] = value;
  });
  return final;
}
class CustomEvent extends Event {
  detail;
  constructor(message, data) {
    super(message, data);
    this.detail = data.detail;
  }
}
const defaultHistoryOptions = {
  minInterval: 300,
  maxSize: 1e6
};
class TextAreaHistory {
  states = [];
  currentIndex = -1;
  // Only <= 0 numbers
  options;
  constructor(options) {
    this.options = mergeDefaultInterface(options, defaultHistoryOptions);
  }
  /**
   * Rollback to the previous state.
   * @returns The previous state, if any.
   */
  undo() {
    if (-this.currentIndex > this.states.length)
      return;
    const prev = this.states.at(this.currentIndex - 1);
    if (!prev)
      return void 0;
    this.currentIndex--;
    return prev;
  }
  /**
   * Move forward one state.
   * @returns The successive value, if any.
   */
  redo() {
    if (this.currentIndex >= -1)
      return;
    const next = this.states.at(this.currentIndex + 1);
    if (!next)
      return void 0;
    this.currentIndex++;
    return next;
  }
  /**
   * Get current stored history in bytes.
   */
  getSize = () => this.states.reduce((acc, curr) => acc + curr.value.length * 2, 0);
  /**
   * Save a value into history.
   * @param value The value to save.
   * @param cursor Cursor position.
   */
  saveState(value, cursor) {
    const latest = this.states.at(-1);
    if (latest?.value === value)
      return;
    if (this.currentIndex < -1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }
    this.currentIndex = -1;
    if (latest && Date.now() - latest.timestamp.getTime() <= (this.options.minInterval ?? 300)) {
      this.states.pop();
    }
    let size = this.getSize();
    this.states.push({
      timestamp: /* @__PURE__ */ new Date(),
      cursor,
      value
    });
    size += value.length * 2;
    while (size > (this.options.maxSize ?? 1e6)) {
      const removed = this.states.shift();
      if (!removed)
        break;
      size -= removed.value.length * 2;
    }
  }
}
class InputEnhancer {
  textarea;
  container;
  settings;
  pressedKeys;
  escapePressed = false;
  // Used to detect keys that actually changed the textarea value
  onKeyDownValue;
  history;
  events = new EventTarget();
  constructor(textarea, container, settings) {
    this.textarea = textarea;
    this.container = container;
    this.settings = settings;
    this.pressedKeys = /* @__PURE__ */ new Set();
    textarea.addEventListener("keydown", this.handleKeyDown.bind(this));
    textarea.addEventListener("keyup", this.handleKeyUp.bind(this));
    textarea.addEventListener("focus", () => {
      this.pressedKeys.clear();
      this.escapePressed = false;
    });
    textarea.addEventListener("blur", () => {
      this.pressedKeys.clear();
    });
    textarea.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.history = new TextAreaHistory(settings.historyOpts);
    this.history.saveState(this.textarea.value, this.textarea.selectionStart);
    for (const listener of settings.listeners)
      textarea.addEventListener(...listener);
  }
  isWordCharacter(char) {
    return new RegExp(/^[a-zA-Z0-9_\-']*$/).test(char);
  }
  handleMouseDown(e) {
    const cursor = this.getSelection().start;
    const currentChar = this.textarea.value.at(cursor);
    if (e.detail == 2 && currentChar != "\n" && currentChar != " ") {
      requestAnimationFrame(() => {
        const isWordChar = this.isWordCharacter(this.textarea.value[cursor]);
        let startPosition = cursor, endPosition = cursor;
        while (startPosition >= 0 && this.isWordCharacter(this.textarea.value[startPosition]) == isWordChar && this.textarea.value[startPosition] != " ")
          startPosition--;
        while (endPosition < this.textarea.value.length && this.isWordCharacter(this.textarea.value[endPosition]) == isWordChar && this.textarea.value[endPosition] != " ")
          endPosition++;
        this.textarea.setSelectionRange(startPosition + 1, endPosition);
      });
    }
  }
  handleKeyDown(e) {
    const key = e.key.toLowerCase();
    this.pressedKeys.add(key);
    const shortcuts = this.settings.shortcuts.filter((shortcut) => areEqualSets(this.pressedKeys, shortcut.combination));
    if (shortcuts.length > 0) {
      e.preventDefault();
      if (shortcuts.length > 1) {
        console.warn(`[carta] Multiple keyboard shortcuts have the same the combination: ${this.pressedKeys}`);
      }
      for (const shortcut of shortcuts) {
        shortcut.action(this);
        if (!shortcut.preventSave)
          this.history.saveState(this.textarea.value, this.textarea.selectionStart);
        this.update();
      }
      this.onKeyDownValue = void 0;
      return;
    }
    if (key === "enter") {
      this.handleNewLine(e);
    } else if (key == "tab" && !this.escapePressed) {
      e.preventDefault();
      let matchedDelimiter = null;
      const tabOutsDelimiters = this.settings.tabOuts.map((tabOut) => tabOut.delimiter).flat();
      for (const delimiter of tabOutsDelimiters) {
        if (this.textarea.value.slice(this.textarea.selectionEnd, this.textarea.selectionEnd + delimiter.length) === delimiter) {
          matchedDelimiter = delimiter;
          break;
        }
      }
      if (matchedDelimiter) {
        const cursor = this.textarea.selectionEnd + matchedDelimiter.length;
        this.textarea.setSelectionRange(cursor, cursor);
      } else {
        if (e.shiftKey) {
          const line = this.getLine();
          const lineStart = line.start;
          const lineContent = line.value;
          const position = this.textarea.selectionStart;
          if (lineContent.startsWith("	")) {
            this.removeAt(lineStart, 1);
            this.textarea.selectionStart = position - 1;
            this.textarea.selectionEnd = position - 1;
          }
        } else {
          const position = this.textarea.selectionStart;
          this.insertAt(this.textarea.selectionStart, "	");
          this.textarea.selectionStart = position + 1;
          this.textarea.selectionEnd = position + 1;
        }
        this.update();
      }
    } else if (key === "escape") {
      this.escapePressed = true;
    }
    this.onKeyDownValue = this.textarea.value;
  }
  handleKeyUp(e) {
    const key = e.key.toLowerCase();
    this.pressedKeys.delete(key);
    if (this.onKeyDownValue !== void 0 && this.textarea.value != this.onKeyDownValue) {
      this.history.saveState(this.textarea.value, this.textarea.selectionStart);
    }
  }
  handleNewLine(e) {
    const cursor = this.textarea.selectionStart;
    let lineStartingIndex;
    for (lineStartingIndex = cursor; lineStartingIndex > 0 && this.textarea.value.at(lineStartingIndex - 1) !== "\n"; lineStartingIndex--)
      ;
    const line = this.textarea.value.slice(lineStartingIndex, cursor);
    for (const prefix of this.settings.prefixes) {
      const match = prefix.match(line);
      if (match) {
        e.preventDefault();
        const strMatch = Array.isArray(match) ? match[0] : match;
        const content = line.slice(strMatch.length).trim();
        if (content === "") {
          const line2 = this.getLine(lineStartingIndex);
          this.removeAt(lineStartingIndex, line2.value.length);
          this.textarea.setSelectionRange(line2.start, line2.start);
          this.update();
          return;
        }
        const newPrefix = prefix.maker(match, line);
        this.insertAt(cursor, "\n" + newPrefix);
        this.update();
        const newCursorPosition = cursor + newPrefix.length + 1;
        this.textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        break;
      }
    }
  }
  /**
   * Get the selected text data.
   * @returns The selection text data.
   */
  getSelection() {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return {
      start,
      end,
      direction: this.textarea.selectionDirection,
      slice: this.textarea.value.slice(start, end)
    };
  }
  /**
   * Get the current line, along with indices information.
   * @returns Current line info.
   */
  getLine(index = this.textarea.selectionStart) {
    let lineStartingIndex, lineEndingIndex;
    for (lineStartingIndex = index; lineStartingIndex > 0 && this.textarea.value.at(lineStartingIndex - 1) !== "\n"; lineStartingIndex--)
      ;
    for (lineEndingIndex = index; lineEndingIndex < this.textarea.value.length - 1 && this.textarea.value.at(lineEndingIndex) !== "\n"; lineEndingIndex++)
      ;
    return {
      start: lineStartingIndex,
      end: lineEndingIndex,
      value: this.textarea.value.slice(lineStartingIndex, lineEndingIndex)
    };
  }
  /**
   * Insert a string at a specific index.
   * @param position The position at which to insert the string.
   * @param string The string to insert.
   */
  insertAt(position, string) {
    const value = this.textarea.value;
    this.textarea.value = value.slice(0, position) + string + value.slice(position);
  }
  /**
   * Remove `count` characters at the provided position.
   * @param position The position to remove characters at.
   * @param count The number of characters to remove.
   */
  removeAt(position, count = 1) {
    const value = this.textarea.value;
    this.textarea.value = value.slice(0, position) + value.slice(position + count);
  }
  /**
   * Surround the current selection with a delimiter.
   * @param delimiter The string delimiter.
   */
  toggleSelectionSurrounding(delimiter) {
    const selection = this.getSelection();
    const delimiterLeft = Array.isArray(delimiter) ? delimiter[0] : delimiter;
    const delimiterRight = Array.isArray(delimiter) ? delimiter[1] : delimiter;
    const prevSection = this.textarea.value.slice(selection.start - delimiterLeft.length, selection.start);
    const nextSection = this.textarea.value.slice(selection.end, selection.end + delimiterRight.length);
    if (prevSection === delimiterLeft && nextSection === delimiterRight) {
      this.removeAt(selection.end, delimiterRight.length);
      this.removeAt(selection.start - delimiterLeft.length, delimiterLeft.length);
      this.textarea.setSelectionRange(selection.start - delimiterRight.length, selection.end - delimiterRight.length);
    } else {
      this.insertAt(selection.end, delimiterRight);
      this.insertAt(selection.start, delimiterLeft);
      this.textarea.setSelectionRange(selection.start + delimiterLeft.length, selection.end + delimiterLeft.length);
    }
  }
  /**
   * Toggle a prefix for the current line.
   * @param prefix The string prefix.
   * @param whitespace Whether to handle whitespace separations.
   */
  toggleLinePrefix(prefix, whitespace = "attach") {
    const selection = this.getSelection();
    let index = selection.start;
    while (index > 0 && this.textarea.value.at(index - 1) !== "\n")
      index--;
    let furtherLinesExist = true;
    const startLocation = selection.start;
    let endLocation = selection.end;
    while (furtherLinesExist) {
      const currentPrefix = this.textarea.value.slice(index, index + prefix.length);
      if (currentPrefix === prefix) {
        if (whitespace === "attach" && this.textarea.value.at(index + prefix.length) === " ") {
          this.removeAt(index, prefix.length + 1);
          endLocation -= prefix.length + 1;
        } else {
          this.removeAt(index, prefix.length);
          endLocation -= prefix.length;
        }
      } else {
        if (whitespace === "attach") {
          this.insertAt(index, prefix + " ");
          endLocation += prefix.length + 1;
        } else {
          this.insertAt(index, prefix);
          endLocation += prefix.length;
        }
      }
      while (index < this.textarea.value.length && this.textarea.value.at(index) !== "\n")
        index++;
      if (this.textarea.value.at(index) == "\n")
        index++;
      furtherLinesExist = index < endLocation;
    }
    this.textarea.setSelectionRange(startLocation, endLocation);
  }
  /**
   * Update the textarea.
   */
  update = () => this.events.dispatchEvent(new Event("update"));
  /**
   * Returns x, y coordinates for absolute positioning of a span within a given text input
   * at a given selection point. [Source](https://jh3y.medium.com/how-to-where-s-the-caret-getting-the-xy-position-of-the-caret-a24ba372990a)
   * @param selectionPoint The selection point for the input. Defaults at current cursor position.
   */
  getCursorXY(selectionPoint = this.textarea.selectionStart) {
    const { offsetLeft: inputX, offsetTop: inputY } = this.textarea;
    const div = document.createElement("div");
    const copyStyle = getComputedStyle(this.textarea);
    for (const prop of copyStyle) {
      div.style[prop] = copyStyle[prop];
    }
    const swap = ".";
    const inputValue = this.textarea.tagName === "INPUT" ? this.textarea.value.replace(/ /g, swap) : this.textarea.value;
    const textContent = inputValue.substr(0, selectionPoint);
    div.textContent = textContent;
    if (this.textarea.tagName === "TEXTAREA")
      div.style.height = "auto";
    if (this.textarea.tagName === "INPUT")
      div.style.width = "auto";
    const span = document.createElement("span");
    span.className += "carta-font-code";
    span.textContent = inputValue.substr(selectionPoint) || ".";
    div.appendChild(span);
    document.body.appendChild(div);
    const { offsetLeft: spanX, offsetTop: spanY } = span;
    document.body.removeChild(div);
    return {
      x: inputX + spanX,
      y: inputY + spanY,
      left: inputX + spanX,
      top: inputY + spanY,
      right: this.textarea.clientWidth - inputX,
      bottom: this.textarea.clientHeight - inputY
    };
  }
  /**
   * Moves an element next to the caret. Shall be called every time the element
   * changes width, height or the caret position changes. Consider using `bindToCaret` instead.
   *
   * @example
   * ```svelte
   * <script>
   *   // ...
   *
   *   export let carta;
   *
   *   let caretPosition;
   *   let elem;
   *
   *   onMount(() => {
   *     carta.input.addEventListener('input', handleInput);
   *   });
   *
   *   onDestroy(() => {
   *     carta.input.removeEventListener('input', handleInput);
   *   });
   *
   *   function handleInput() {
   *   	 caretPosition = carta.input.getCursorXY();
   *   }
   *
   *   $: {
   *     caretPosition, elem.clientWidth, elem.clientHeight;
   *     carta.input.moveElemToCaret(elem);
   *   }
   * <\/script>
   *
   * <div bind:this={elem}>
   *   <!-- My stuff -->
   * </div>
   * ```
   *
   * @param elem The element to move.
   */
  moveElemToCaret(elem) {
    const elemWidth = elem.clientWidth;
    const elemHeight = elem.clientHeight;
    const caretPosition = this.getCursorXY();
    const fontSize = this.getRowHeight();
    let left = caretPosition.left;
    let right;
    if (elemWidth < this.container.clientWidth && left + elemWidth - this.container.scrollLeft >= this.container.clientWidth) {
      right = this.container.clientWidth - left;
      left = void 0;
    }
    let top = caretPosition.top;
    let bottom;
    if (elemHeight < this.container.clientHeight && top + elemHeight - this.container.scrollTop >= this.container.clientHeight) {
      bottom = this.container.clientHeight - top;
      top = void 0;
    }
    elem.style.left = left !== void 0 ? left + "px" : "unset";
    elem.style.right = right !== void 0 ? right + "px" : "unset";
    elem.style.top = top !== void 0 ? top + fontSize + "px" : "unset";
    elem.style.bottom = bottom !== void 0 ? bottom + "px" : "unset";
  }
  /**
   * **Internal**: Svelte action to bind an element to the caret position.
   * Use `bindToCaret` from the `carta` instance instead.
   * @param elem The element to position.
   * @param portal The portal to append the element to. Defaults to `document.body`.
   */
  $bindToCaret(elem, data) {
    data.portal.appendChild(elem);
    const themeClass = Array.from(data.editorElement?.classList ?? []).find((c) => c.startsWith("carta-theme__"));
    elem.classList.add(themeClass ?? "carta-theme__default");
    elem.style.position = "fixed";
    const callback = () => {
      const relativePosition = this.getCursorXY();
      const absolutePosition = {
        x: relativePosition.x + this.textarea.getBoundingClientRect().left,
        y: relativePosition.y + this.textarea.getBoundingClientRect().top
      };
      const fontSize = this.getRowHeight();
      const width = elem.clientWidth;
      const height = elem.clientHeight;
      let left = absolutePosition.x;
      let right;
      if (left + width >= window.innerWidth) {
        right = window.innerWidth - left;
        left = void 0;
      }
      let top = absolutePosition.y;
      let bottom;
      if (top + height >= window.innerHeight) {
        bottom = window.innerHeight - top;
        top = void 0;
      }
      elem.style.left = left !== void 0 ? left + "px" : "unset";
      elem.style.right = right !== void 0 ? right + "px" : "unset";
      elem.style.top = top !== void 0 ? top + fontSize + "px" : "unset";
      elem.style.bottom = bottom !== void 0 ? bottom + "px" : "unset";
    };
    this.textarea.addEventListener("input", callback);
    window.addEventListener("resize", callback);
    window.addEventListener("scroll", callback);
    callback();
    return {
      destroy: () => {
        try {
          data.portal.removeChild(elem);
        } catch {
        }
        this.textarea.removeEventListener("input", callback);
        window.removeEventListener("resize", callback);
        window.removeEventListener("scroll", callback);
      }
    };
  }
  /**
   * Get rough value for a row of the textarea.
   */
  getRowHeight() {
    const rawLineHeight = getComputedStyle(this.container).lineHeight;
    const lineHeight = parseFloat(rawLineHeight);
    const fontSize = parseFloat(getComputedStyle(this.container).fontSize);
    if (isNaN(lineHeight)) {
      return Math.ceil(fontSize * 1.2);
    }
    if (rawLineHeight.endsWith("em")) {
      return Math.ceil(lineHeight * fontSize);
    }
    if (rawLineHeight.endsWith("%")) {
      return Math.ceil(lineHeight / 100 * fontSize);
    }
    if (rawLineHeight.endsWith("px")) {
      return Math.ceil(lineHeight);
    }
    return Math.ceil(fontSize * lineHeight);
  }
}
const defaultKeyboardShortcuts = [
  // Bold text
  {
    id: "bold",
    combination: /* @__PURE__ */ new Set(["control", "b"]),
    action: (input) => input.toggleSelectionSurrounding("**")
  },
  // Italic text
  {
    id: "italic",
    combination: /* @__PURE__ */ new Set(["control", "i"]),
    action: (input) => input.toggleSelectionSurrounding("*")
  },
  // Quote
  {
    id: "quote",
    combination: /* @__PURE__ */ new Set(["control", "shift", ","]),
    action: (input) => input.toggleLinePrefix(">")
  },
  // Link
  {
    id: "link",
    combination: /* @__PURE__ */ new Set(["control", "k"]),
    action: (input) => {
      input.toggleSelectionSurrounding(["[", "]"]);
      const position = input.getSelection().end + 1;
      input.insertAt(position, "(url)");
      input.textarea.setSelectionRange(position + 1, position + 4);
    }
  },
  // Strikethrough
  {
    id: "strikethrough",
    combination: /* @__PURE__ */ new Set(["control", "shift", "x"]),
    action: (input) => input.toggleSelectionSurrounding("~~")
  },
  // Code
  {
    id: "code",
    combination: /* @__PURE__ */ new Set(["control", "e"]),
    action: (input) => input.toggleSelectionSurrounding("`")
  },
  // Undo
  {
    id: "undo",
    combination: /* @__PURE__ */ new Set(["control", "z"]),
    preventSave: true,
    action: (input) => {
      const previousState = input.history.undo();
      if (!previousState)
        return;
      input.textarea.value = previousState.value;
      input.textarea.selectionStart = previousState.cursor;
      input.textarea.selectionEnd = previousState.cursor;
    }
  },
  // Redo
  {
    id: "redo",
    combination: /* @__PURE__ */ new Set(["control", "y"]),
    preventSave: true,
    action: (input) => {
      const successiveValue = input.history.redo();
      if (!successiveValue)
        return;
      input.textarea.value = successiveValue.value;
      input.textarea.selectionStart = successiveValue.cursor;
      input.textarea.selectionEnd = successiveValue.cursor;
    }
  }
];
const HeadingIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4.5 2.75a.75.75 0 0 0-1.5 0v10.5a.75.75 0 0 0 1.5 0v-4.5h7v4.5a.75.75 0 0 0 1.5 0V2.75a.75.75 0 0 0-1.5 0v4.5h-7v-4.5Z" clip-rule="evenodd"></path></svg>`;
});
const ItalicIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M6.5 2a.75.75 0 0 0 0 1.5h1.93l-2.412 9H4A.75.75 0 0 0 4 14h5.5a.75.75 0 0 0 0-1.5H7.57l2.412-9H12A.75.75 0 0 0 12 2H6.5Z" clip-rule="evenodd"></path></svg>`;
});
const BoldIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5a3.5 3.5 0 0 0 1.852-6.47A3.5 3.5 0 0 0 8.5 2H4Zm4.5 5a1.5 1.5 0 1 0 0-3H5v3h3.5ZM5 9v3h4.5a1.5 1.5 0 0 0 0-3H5Z" clip-rule="evenodd"></path></svg>`;
});
const QuoteIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M1.5 3.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5ZM4.75 3a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>`;
});
const LinkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M9.929 3.132a2.078 2.078 0 1 1 2.94 2.94l-.65.648a.75.75 0 0 0 1.061 1.06l.649-.648a3.579 3.579 0 0 0-5.06-5.06L6.218 4.72a3.578 3.578 0 0 0 0 5.06a.75.75 0 0 0 1.061-1.06a2.078 2.078 0 0 1 0-2.94L9.93 3.132Zm-.15 3.086a.75.75 0 0 0-1.057 1.064c.816.81.818 2.13.004 2.942l-2.654 2.647a2.08 2.08 0 0 1-2.94-2.944l.647-.647a.75.75 0 0 0-1.06-1.06l-.648.647a3.58 3.58 0 0 0 5.06 5.066l2.654-2.647a3.575 3.575 0 0 0-.007-5.068Z" clip-rule="evenodd"></path></svg>`;
});
const ListBulletedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M1 4.75a1 1 0 1 0 0-2a1 1 0 0 0 0 2ZM4.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75ZM2 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm-1 5.25a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" clip-rule="evenodd"></path></svg>`;
});
const ListNumberedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M0 2h2v4H1V3H0V2Zm1.637 9.008H0v-1h1.637a1.382 1.382 0 0 1 .803 2.506L1.76 13H3v1H0v-.972L1.859 11.7a.382.382 0 0 0-.222-.693ZM4.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm0 4.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H4.75Zm-.75 5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg>`;
});
const ListTaskIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M4.78 3.28a.75.75 0 0 0-1.06-1.06L1.75 4.19l-.47-.47A.75.75 0 0 0 .22 4.78l1 1a.75.75 0 0 0 1.06 0l2.5-2.5ZM6 3.75A.75.75 0 0 1 6.75 3h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 6 3.75ZM6 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 6 8Zm.75 3.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Zm-1.97-1.28a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-1-1a.75.75 0 1 1 1.06-1.06l.47.47l1.97-1.97a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"></path></svg>`;
});
const CodeIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M9.424 2.023a.75.75 0 0 1 .556.904L7.48 13.42a.75.75 0 0 1-1.46-.348L8.52 2.58a.75.75 0 0 1 .904-.556ZM11.16 4.22a.75.75 0 0 1 1.06 0l3.25 3.25L16 8l-.53.53l-3.25 3.25a.75.75 0 1 1-1.06-1.06L13.88 8l-2.72-2.72a.75.75 0 0 1 0-1.06ZM4.84 5.28a.75.75 0 1 0-1.06-1.06L.53 7.47L0 8l.53.53l3.25 3.25a.75.75 0 0 0 1.06-1.06L2.12 8l2.72-2.72Z" clip-rule="evenodd"></path></svg>`;
});
const StrikethroughIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="16" height="16" fill="none" stroke="none"></rect><path fill="currentColor" fill-rule="evenodd" d="M7.886 1a3.136 3.136 0 0 0-2.41 5.144L6.4 7.25H2.75a.75.75 0 0 0 0 1.5h4.899l1.722 2.066A1.636 1.636 0 0 1 8.114 13.5H8a1.75 1.75 0 0 1-1.75-1.75a.75.75 0 0 0-1.5 0A3.25 3.25 0 0 0 8 15h.114a3.136 3.136 0 0 0 2.41-5.144L9.6 8.75h3.649a.75.75 0 0 0 0-1.5H8.351L6.63 5.184A1.636 1.636 0 0 1 7.886 2.5H8c.966 0 1.75.784 1.75 1.75a.75.75 0 0 0 1.5 0A3.25 3.25 0 0 0 8 1h-.114Z" clip-rule="evenodd"></path></svg>`;
});
const defaultIcons = [
  {
    id: "heading",
    action: (input) => input.toggleLinePrefix("###"),
    component: HeadingIcon,
    label: "Heading"
  },
  {
    id: "bold",
    action: (input) => input.toggleSelectionSurrounding("**"),
    component: BoldIcon,
    label: "Bold"
  },
  {
    id: "italic",
    action: (input) => input.toggleSelectionSurrounding("*"),
    component: ItalicIcon,
    label: "Italic"
  },
  {
    id: "strikethrough",
    action: (input) => input.toggleSelectionSurrounding("~~"),
    component: StrikethroughIcon,
    label: "Strikethrough"
  },
  {
    id: "quote",
    action: (input) => input.toggleLinePrefix(">"),
    component: QuoteIcon,
    label: "Quote"
  },
  {
    id: "code",
    action: (input) => input.toggleSelectionSurrounding("`"),
    component: CodeIcon,
    label: "Code"
  },
  {
    id: "link",
    action: (input) => {
      input.toggleSelectionSurrounding(["[", "]"]);
      const position = input.getSelection().end + 1;
      input.insertAt(position, "(url)");
      input.textarea.setSelectionRange(position + 1, position + 4);
    },
    component: LinkIcon,
    label: "Link"
  },
  {
    id: "bulletedList",
    action: (input) => input.toggleLinePrefix("- ", "detach"),
    component: ListBulletedIcon,
    label: "Bulleted list"
  },
  {
    id: "numberedList",
    action: (input) => input.toggleLinePrefix("1. ", "detach"),
    component: ListNumberedIcon,
    label: "Numbered list"
  },
  {
    id: "taskList",
    action: (input) => input.toggleLinePrefix("- [ ] ", "detach"),
    component: ListTaskIcon,
    label: "Task list"
  }
];
const matchRegexs = {
  taskList: /^(\s*)(-\s+\[)[ xX]?(\]\s+)/,
  bulletedList: /^(\s*)([-*]\s+)/,
  numberedList: /^(\s*)(\d+)(\.\s+)/,
  blockquote: /^(\s*)([> ]*[>]\s+)/
};
const defaultPrefixes = [
  {
    id: "taskList",
    match: (line) => matchRegexs.taskList.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]} ${prev[3]}`
  },
  {
    id: "bulletedList",
    match: (line) => matchRegexs.bulletedList.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]}`
  },
  {
    id: "numberedList",
    match: (line) => matchRegexs.numberedList.exec(line),
    maker: (prev) => `${prev[1]}${Number(prev[2]) + 1}${prev[3]}`
  },
  {
    id: "blockquote",
    match: (line) => matchRegexs.blockquote.exec(line),
    maker: (prev) => `${prev[1]}${prev[2]}`
  }
];
class Renderer {
  container;
  constructor(container) {
    this.container = container;
  }
}
const defaultTabOuts = [
  {
    id: "bold",
    delimiter: "**"
  },
  {
    id: "italic",
    delimiter: ["*", "_"]
  },
  {
    id: "link",
    delimiter: ")"
  },
  {
    id: "strikethrough",
    delimiter: "~~"
  },
  {
    id: "inline-code",
    delimiter: "`"
  },
  {
    id: "block-code",
    delimiter: "\n```"
  }
];
const cartaEvents = ["carta-render", "carta-render-ssr"];
class Carta {
  sanitizer;
  historyOptions;
  theme;
  shikiOptions;
  rehypeOptions;
  rendererDebounce;
  keyboardShortcuts;
  icons;
  prefixes;
  tabOuts;
  grammarRules;
  highlightingRules;
  textareaListeners;
  cartaListeners;
  components;
  dispatcher = new EventTarget();
  gfmOptions;
  syncProcessor;
  asyncProcessor;
  mElement;
  mInput;
  mRenderer;
  mHighlighter;
  mSyncTransformers = [];
  mAsyncTransformers = [];
  get element() {
    return this.mElement;
  }
  get input() {
    return this.mInput;
  }
  get renderer() {
    return this.mRenderer;
  }
  async highlighter() {
    if (this.mHighlighter)
      return this.mHighlighter;
    if (
      // Replaced at build time to tree-shake shiki on the server, if specified
      typeof __ENABLE_CARTA_SSR_HIGHLIGHTER__ !== "undefined" && __ENABLE_CARTA_SSR_HIGHLIGHTER__ === false
    )
      return;
    this.mHighlighter = (async () => {
      const hl = await import("../../../../../../chunks/highlight.js");
      const { loadHighlighter, loadDefaultTheme } = hl;
      return loadHighlighter({
        theme: this.theme ?? await loadDefaultTheme(),
        grammarRules: this.grammarRules,
        highlightingRules: this.highlightingRules,
        shiki: this.shikiOptions
      });
    })();
    return this.mHighlighter;
  }
  elementsToBind = [];
  constructor(options) {
    this.sanitizer = options?.sanitizer || void 0;
    this.historyOptions = options?.historyOptions;
    this.theme = options?.theme;
    this.shikiOptions = options?.shikiOptions;
    this.rendererDebounce = options?.rendererDebounce ?? 300;
    this.keyboardShortcuts = [];
    this.icons = [];
    this.prefixes = [];
    this.tabOuts = [];
    this.textareaListeners = [];
    this.cartaListeners = [];
    this.components = [];
    this.grammarRules = [];
    this.highlightingRules = [];
    this.rehypeOptions = options?.rehypeOptions ?? {};
    const listeners = [];
    for (const ext of options?.extensions ?? []) {
      this.keyboardShortcuts.push(...ext.shortcuts ?? []);
      this.icons.push(...ext.icons ?? []);
      this.prefixes.push(...ext.prefixes ?? []);
      this.tabOuts.push(...ext.tabOuts ?? []);
      this.components.push(...ext.components ?? []);
      this.grammarRules.push(...ext.grammarRules ?? []);
      this.highlightingRules.push(...ext.highlightingRules ?? []);
      listeners.push(...ext.listeners ?? []);
    }
    this.textareaListeners = listeners.filter((it) => !cartaEvents.includes(it[0]));
    this.cartaListeners = listeners.filter((it) => cartaEvents.includes(it[0]));
    this.cartaListeners.forEach((it) => {
      this.dispatcher.addEventListener(...it);
    });
    this.keyboardShortcuts.push(...defaultKeyboardShortcuts.filter((shortcut) => options?.disableShortcuts === true ? false : !options?.disableShortcuts?.includes(shortcut.id)));
    this.icons.unshift(...defaultIcons.filter((icon) => options?.disableIcons === true ? false : !options?.disableIcons?.includes(icon.id)));
    this.prefixes.push(...defaultPrefixes.filter((prefix) => options?.disablePrefixes === true ? false : !options?.disablePrefixes?.includes(prefix.id)));
    this.tabOuts.push(...defaultTabOuts.filter((tabOut) => options?.disableTabOuts === true ? false : !options?.disableTabOuts?.includes(tabOut.id)));
    this.mSyncTransformers = [];
    this.mAsyncTransformers = [];
    for (const ext of options?.extensions ?? []) {
      for (const transformer of ext.transformers ?? []) {
        if (transformer.execution === "sync") {
          this.mSyncTransformers.push(transformer);
        } else {
          this.mAsyncTransformers.push(transformer);
        }
      }
    }
    this.gfmOptions = options?.gfmOptions;
    this.syncProcessor = this.setupSynchronousProcessor({
      gfmOptions: this.gfmOptions,
      rehypeOptions: this.rehypeOptions
    });
    this.asyncProcessor = this.setupAsynchronousProcessor({
      gfmOptions: this.gfmOptions,
      rehypeOptions: this.rehypeOptions
    });
    for (const ext of options?.extensions ?? []) {
      if (ext.onLoad) {
        ext.onLoad({
          carta: this
        });
      }
    }
  }
  setupSynchronousProcessor({ gfmOptions, rehypeOptions }) {
    const syncProcessor = unified();
    const remarkPlugins = this.mSyncTransformers.filter((it) => it.type === "remark");
    const rehypePlugins = this.mSyncTransformers.filter((it) => it.type === "rehype");
    syncProcessor.use(remarkParse);
    syncProcessor.use(remarkGfm, gfmOptions);
    for (const plugin of remarkPlugins) {
      plugin.transform({ processor: syncProcessor, carta: this });
    }
    syncProcessor.use(remarkRehype, rehypeOptions);
    for (const plugin of rehypePlugins) {
      plugin.transform({ processor: syncProcessor, carta: this });
    }
    syncProcessor.use(rehypeStringify);
    return syncProcessor;
  }
  async setupAsynchronousProcessor({ gfmOptions, rehypeOptions }) {
    const asyncProcessor = unified();
    const remarkPlugins = [...this.mSyncTransformers, ...this.mAsyncTransformers].filter((it) => it.type === "remark");
    const rehypePlugins = [...this.mSyncTransformers, ...this.mAsyncTransformers].filter((it) => it.type === "rehype");
    asyncProcessor.use(remarkParse);
    asyncProcessor.use(remarkGfm, gfmOptions);
    for (const plugin of remarkPlugins) {
      await plugin.transform({ processor: asyncProcessor, carta: this });
    }
    asyncProcessor.use(remarkRehype, rehypeOptions);
    for (const plugin of rehypePlugins) {
      await plugin.transform({ processor: asyncProcessor, carta: this });
    }
    asyncProcessor.use(rehypeStringify);
    return asyncProcessor;
  }
  /**
   * Render markdown to html asynchronously.
   * @param markdown Markdown input.
   * @returns Rendered html.
   */
  async render(markdown) {
    if (
      // Replaced at build time to tree-shake shiki on the server, if specified
      typeof __ENABLE_CARTA_SSR_HIGHLIGHTER__ === "undefined" || __ENABLE_CARTA_SSR_HIGHLIGHTER__ === true
    ) {
      const hl = await import("../../../../../../chunks/highlight.js");
      const { loadNestedLanguages } = hl;
      const highlighter = await this.highlighter();
      await loadNestedLanguages(highlighter, markdown);
    }
    const processor = await this.asyncProcessor;
    const result = await processor.process(markdown);
    if (!result)
      return "";
    const dirty = String(result);
    this.dispatcher.dispatchEvent(new CustomEvent("carta-render", { detail: { carta: this } }));
    return (this.sanitizer && this.sanitizer(dirty)) ?? dirty;
  }
  /**
   * Render markdown, excluding syntax highlighting (SSR).
   * @param markdown Markdown input.
   * @returns Rendered html.
   */
  renderSSR(markdown) {
    const dirty = String(this.syncProcessor.processSync(markdown));
    if (typeof dirty != "string")
      return "";
    this.dispatcher.dispatchEvent(new CustomEvent("carta-render-ssr", { detail: { carta: this } }));
    if (this.sanitizer)
      return this.sanitizer(dirty);
    return dirty;
  }
  /**
   * **Internal**: set the editor element.
   * @param element The editor element.
   */
  $setElement(element) {
    this.mElement = element;
  }
  /**
   * **Internal**: set the input element.
   * @param textarea The input textarea element.
   * @param callback Update callback.
   */
  $setInput(textarea, container, callback) {
    const previousInput = this.input;
    this.mInput = new InputEnhancer(textarea, container, {
      shortcuts: this.keyboardShortcuts,
      prefixes: this.prefixes,
      tabOuts: this.tabOuts,
      listeners: this.textareaListeners,
      historyOpts: this.historyOptions
    });
    if (previousInput) {
      previousInput.events.removeEventListener("update", callback);
      this.mInput.history = previousInput.history;
    }
    this.mInput.events.addEventListener("update", callback);
    this.elementsToBind.forEach((it) => {
      it.callback = this.input?.$bindToCaret(it.elem, {
        portal: it.portal,
        editorElement: this.element
      }).destroy;
    });
  }
  /**
   * **Internal**: set the renderer element.
   * @param container Div container of the rendered element.
   */
  $setRenderer(container) {
    this.mRenderer = new Renderer(container);
  }
  /**
   * Bind an element to the caret position.
   * @param element The element to bind.
   * @param portal The portal element.
   * @returns The unbind function.
   *
   * @example
   * ```svelte
   * <script>
   *   export let carta;
   * <\/script>
   *
   * <div use:carta.bindToCaret>
   *   <!-- Stuff here -->
   * </div>
   *
   * ```
   */
  bindToCaret(element, portal = document.querySelector("body")) {
    let callback;
    if (this.input)
      callback = this.input.$bindToCaret(element, { portal, editorElement: this.element }).destroy;
    this.elementsToBind.push({ elem: element, portal, callback });
    return {
      destroy: () => {
        callback && callback();
        this.elementsToBind = this.elementsToBind.filter((it) => it.elem != element);
      }
    };
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const carta = new Carta({ sanitize: false });
  getDrawerStore();
  let html = "";
  let error = null;
  async function renderMarkdown() {
    try {
      if (data.props.markdown) {
        html = await carta.render(data.props.markdown);
      } else {
        throw new Error("No file found at this location");
      }
    } catch (err) {
      error = err;
    }
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  {
    if (data.props.markdown) {
      renderMarkdown();
    }
  }
  return ` <button class="btn-icon variant-ghost-surface md:hidden fixed top-[4.5rem] right-4 z-20" data-svelte-h="svelte-1duewoi"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>  ${validate_component(Drawer, "Drawer").$$render($$result, {}, {}, {
    default: () => {
      return `<nav class="list-nav p-4">${each(data.props.files, (file) => {
        let isActive = data.props.slug === file.path;
        return ` <a href="${"/docs/" + escape(file.path, true)}" class="${"block px-4 py-2 rounded-lg " + escape(
          isActive ? "bg-primary-500 text-white" : "hover:bg-surface-500/10",
          true
        )}">${escape(file.title)} </a>`;
      })}</nav>`;
    }
  })}  <div class="flex"> <div class="hidden md:block w-64 h-screen bg-surface-700/5 p-4 border-r border-surface-500/20 sticky top-0"><nav class="space-y-1">${each(data.props.files, (file) => {
    let isActive = data.props.slug === file.path;
    return ` <a href="${"/docs/" + escape(file.path, true)}" class="${"block px-4 py-2 rounded-lg " + escape(
      isActive ? "bg-primary-500 text-white" : "hover:bg-surface-500/10",
      true
    )}">${escape(file.title)} </a>`;
  })}</nav></div> <div class="flex-1 container mx-auto px-4 py-8 md:px-8">${error ? `<p class="text-error-500">Error: ${escape(error.message)}</p>` : `${!html ? `<p class="text-surface-500" data-svelte-h="svelte-th82js">Loading...</p>` : `<div class="prose prose-slate dark:prose-invert max-w-none"><!-- HTML_TAG_START -->${html}<!-- HTML_TAG_END --></div>`}`}</div></div>`;
});
export {
  Page as default
};
