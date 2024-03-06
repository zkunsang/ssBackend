


(async () => {
  const SymSpell = require('node-symspell')
  const maxEditDistance = 2
  const prefixLength = 7
  const symSpell = new SymSpell(maxEditDistance, prefixLength)
  await symSpell.loadDictionary("./ko.txt", 0, 1)
  // await symSpell.loadBigramDictionary(bigramPath, 0, 2)

  const typo = 'apple'
  const results = symSpell.lookupCompound(typo, maxEditDistance)
  console.log(results);
})()