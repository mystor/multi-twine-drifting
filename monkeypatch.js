// This script is used to monkey patch the Twine runtime into understanding the
// concept of global variables. It exports no additional concepts from the game
// world.

(() => {
  // Record some information in the global scope about where to find the
  // "global" state object.
  let glbl = window;
  while (glbl.opener) { glbl = glbl.opener; }
  window.top_window = glbl;

  // Stash a reference to this window in the `remote` object.
  window.remote = window.top_window.remote || {};
  window.remote[window.name || "main"] = window;

  // Match the behaviour of the built-in Wikifier variable matcher, except look
  // for a g_ at the beginning of the variable name.
  let global_var = "\\$g_((?:" +
      Wikifier.textPrimitives.anyLetter.replace("\\-", "") +
      ")*)" + Wikifier.textPrimitives.unquoted;

  // We're going to need to monkey-patch the Wikifier.parse method, which
  // handles transforming variables (like "$foo") into actual JS code.
  let old_parser = Wikifier.parse;
  Wikifier.parse = function(input) {
    // This part is based on the source code for Wikifier.parse
    // https://github.com/tweecode/twine/blob/f0e6caf4b3857cccdb4043313997dda36f55dd06/targets/engine.js#L1489-L1521

    let output = input;

    // Extract all variables & initialize them to 0 if they're undefined
    let init_re = new RegExp(global_var, "gi");
    let found = [];
    let m;
    while ((m = init_re.exec(input))) {
      if (found.indexOf(m[0]) === -1) {
        output = m[0] + " == null && (" + m[0] + " = 0);" + output;
        found.push(m[0]);
      }
    }

    // Rewrite $var into valid JS code
    let pat = "top_window.state.history[0].variables.$1";
    output = output.replace(new RegExp(global_var, "gi"), pat);

    console.log(output);

    // And now we can call the version we're patching
    return old_parser.call(this, output);
  };
})();
