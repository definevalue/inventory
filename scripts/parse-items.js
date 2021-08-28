// Imports
const fs = require("fs");

const inventorySlots = {
  chest: [],
  foot: [],
  hand: [],
  head: [],
  neck: [],
  ring: [],
  waist: [],
  weapon: [],
};

// Load data
const dataLoot = fs.readFileSync("data/loot.json");
const dataParts = fs.readFileSync("data/item-parts.json");
const loot = JSON.parse(dataLoot);
const parts = JSON.parse(dataParts);
const { suffixes, namePrefixes, nameSuffixes } = parts;

// Add item to inventory slot list if it's not already there
const itemParts = [];
const items = loot.reduce((slots, bag, index) => {
  const id = index + 1;
  const bagSlots = bag[id];
  Object.keys(bagSlots).forEach((slot) => {
    const item = bagSlots[slot];

    itemParts.push({ [id]: parseItemParts(bagSlots) });

    if (!slots[slot].includes(item)) {
      slots[slot] = [...slots[slot], item];
    }
  });
  return slots;
}, inventorySlots);

function parseItemParts(item) {
  return Object.keys(item).reduce((acc, slot) => {
    const name = item[slot];
    acc[slot] = {
      item: findItemType(name, parts),
      suffix: suffixes.find((suffix) => name.includes(suffix)) || null,
      namePrefix: namePrefixes.find((prefix) => name.includes(prefix)) || null,
      nameSuffix: nameSuffixes.find((suffix) => name.includes(suffix)) || null,
      bonus: slot.includes("+1"),
    };

    return acc;
  }, {});
}

function findItemType(item, parts) {
  const hasPart = (part) => item.includes(part);
  const weapon = parts.weapons.filter(hasPart)[0];
  if (weapon) return weapon;
  const chest = parts.chestArmor.filter(hasPart)[0];
  if (chest) return chest;
  const head = parts.headArmor.filter(hasPart)[0];
  if (head) return head;
  const waist = parts.waistArmor.filter(hasPart)[0];
  if (waist) return waist;
  const foot = parts.footArmor.filter(hasPart)[0];
  if (foot) return foot;
  const hand = parts.handArmor.filter(hasPart)[0];
  if (hand) return hand;
  const necklace = parts.necklaces.filter(hasPart)[0];
  if (necklace) return necklace;
  const ring = parts.rings.filter(hasPart)[0];
  if (ring) return ring;
}

// Output items
fs.writeFileSync("data/items.json", JSON.stringify(items, null, 2));
fs.writeFileSync("data/loot-parts.json", JSON.stringify(itemParts, null, 2));
