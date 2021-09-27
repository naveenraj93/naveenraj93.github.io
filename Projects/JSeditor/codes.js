window.savedCodes = {
    bubbleSort: "\n//JS Code Editor \n//Please code below...\nconst bubbleSort = arr => {\n  let swapped = false;\n  const a = [...arr];\n  for (let i = 1; i < a.length; i++) {\n    swapped = false;\n    for (let j = 0; j < a.length - i; j++) {\n      if (a[j + 1] < a[j]) {\n        [a[j], a[j + 1]] = [a[j + 1], a[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) return a;\n  }\n  return a;\n};\nconsole.log(\"priting Values\");\nbubbleSort([2, 1, 4, 3]);",

}