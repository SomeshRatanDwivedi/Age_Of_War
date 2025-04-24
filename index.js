const unitAdvantages = {
  Militia: ["Spearmen", "LightCavalry"],
  Spearmen: ["LightCavalry", "HeavyCavalry"],
  LightCavalry: ["FootArcher", "CavalryArcher"],
  HeavyCavalry: ["Militia", "FootArcher", "LightCavalry"],
  CavalryArcher: ["Spearmen", "HeavyCavalry"],
  FootArcher: ["Militia", "CavalryArcher"],
};

// Converts a string like "Militia#30" into an object like { type: "Militia", count: 30 }
function getPlatoonDetails(platoonString) {
  return platoonString.split(";").map(item => {
    const [name, num] = item.split("#");
    return { type: name, count: Number(num) };
  });
}

// Determines battle result between two platoons
function getBattleOutcome(ownUnit, enemyUnit) {
  let ownPower = ownUnit.count;
  let enemyPower = enemyUnit.count;

  if (unitAdvantages[ownUnit.type]?.includes(enemyUnit.type)) {
    ownPower *= 2;
  } else if (unitAdvantages[enemyUnit.type]?.includes(ownUnit.type)) {
    enemyPower *= 2;
  }

  if (ownPower > enemyPower) return "win";
  if (ownPower === enemyPower) return "draw";
  return "loss";
}

// Returns all possible orders in which platoons can be arranged
function generateAllOrders(units) {
  if (units.length === 0) return [[]];

  const results = [];

  for (let i = 0; i < units.length; i++) {
    const picked = units[i];
    const rest = [...units.slice(0, i), ...units.slice(i + 1)];
    const perms = generateAllOrders(rest);
    
    for (const combo of perms) {
      results.push([picked, ...combo]);
    }
  }

  return results;
}

// Finds a lineup that wins at least 3 out of 5 battles
function planAttack(myLineup, enemyLineup) {
  const myTroops = getPlatoonDetails(myLineup);
  const enemyTroops = getPlatoonDetails(enemyLineup);

  const allCombinations = generateAllOrders(myTroops);

  for (const combo of allCombinations) {
    let winCount = 0;

    for (let i = 0; i < combo.length; i++) {
      const outcome = getBattleOutcome(combo[i], enemyTroops[i]);
      if (outcome === "win") {
        winCount++;
      }
    }

    if (winCount >= 3) {
      return combo.map(unit => `${unit.type}#${unit.count}`).join(";");
    }
  }

  return "There is no chance of winning";
}

// Sample input
const myArmy = "Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120";
const enemyArmy = "Militia#10;Spearmen#10;FootArcher#1000;LightCavalry#120;CavalryArcher#100";

console.log(planAttack(myArmy, enemyArmy));
