import controls from '../../constants/controls';

function getRandomNumber(min = 1, max = 2) {
    return Math.random() * (max - min) + min;
}

function getHitPower(fighter) {
    return fighter.attack * getRandomNumber();
}

function getBlockPower(fighter) {
    return fighter.defense * getRandomNumber();
}

function getDamage(attacker, defender = null) {
    const bonusAttack = getHitPower(attacker);
    if (defender === null) return bonusAttack;

    const bonusDefense = getBlockPower(defender);
    if (bonusAttack <= bonusDefense) return 0;
    return bonusAttack - bonusDefense;
}

export function getCriticalDamage(attacker) {
    return 2 * attacker.attack;
}

export async function fight([firstFighter, secondFighter]) {
    return new Promise(resolve => {
        let winner = null;
        // console.log(firstFighter, secondFighter);

        let fistPlayerHealth = firstFighter.health;
        let secondPlayerHealth = secondFighter.health;
        //         console.log(fistPlayerHealth);
        //   console.log(secondPlayerHealth);

        let firstPlayerCriticalHitCombination = [];
        let secondPlayerCriticalHitCombination = [];

        let firstPlayerCriticalHitCombinationIsActive = true;
        let secondPlayerCriticalHitCombinationIsActive = true;

        let fistPlayerMove = '';
        let secondPlayerMove = '';

        function keyCodeListener(e) {
            if (fistPlayerHealth <= 0 || secondPlayerHealth <= 0) return;
            const keydown = e.code;
            switch (keydown) {
                case controls.PlayerOneAttack:
                    fistPlayerMove = 'attack';
                    if (secondPlayerMove === 'attack' || secondPlayerMove === '') {
                        secondPlayerHealth -= getDamage(firstFighter);
                    }
                    if (secondPlayerMove === 'defense') {
                        secondPlayerHealth -= getDamage(firstFighter, secondFighter);
                    }
                    if (secondPlayerHealth <= 0) {
                        // console.log('First Fighter WIN!!!!');
                        winner = firstFighter;
                        resolve(winner);
                    }
                    //   console.log(fistPlayerHealth);
                    //   console.log(secondPlayerHealth);

                    break;

                case controls.PlayerTwoAttack:
                    secondPlayerMove = 'attack';
                    if (fistPlayerMove === 'attack' || fistPlayerMove === '') {
                        fistPlayerHealth -= getDamage(secondFighter);
                    }
                    if (fistPlayerMove === 'defense') {
                        fistPlayerHealth -= getDamage(secondFighter, firstFighter);
                    }
                    if (fistPlayerHealth <= 0) {
                        // console.log('Second Fighter WIN!!!!');
                        winner = secondFighter;
                        resolve(winner);
                    }
                    // console.log(fistPlayerHealth);
                    // console.log(secondPlayerHealth);
                    break;

                case controls.PlayerOneBlock:
                    fistPlayerMove = 'defense';
                    break;

                case controls.PlayerTwoBlock:
                    secondPlayerMove = 'defense';
                    break;

                case controls.PlayerOneCriticalHitCombination[0]:
                case controls.PlayerOneCriticalHitCombination[1]:
                case controls.PlayerOneCriticalHitCombination[2]:
                    if (!firstPlayerCriticalHitCombinationIsActive) {
                        // console.log('First Fighter Await 10s!!');
                        break;
                    }
                    if (firstPlayerCriticalHitCombination.indexOf(keydown) === -1) {
                        firstPlayerCriticalHitCombination.push(keydown);
                    }
                    if (firstPlayerCriticalHitCombination.length === 3) {
                        // console.log(`Critical DAMAGE -${2 * firstFighter.attack}!`);
                        secondPlayerHealth -= getCriticalDamage(firstFighter);
                        //   console.log(getCriticalDamage(firstFighter));
                        firstPlayerCriticalHitCombination = [];
                        firstPlayerCriticalHitCombinationIsActive = false;
                        setTimeout(() => {
                            firstPlayerCriticalHitCombinationIsActive = true;
                        }, 10000);
                    }
                    if (secondPlayerHealth <= 0) {
                        // console.log('First Fighter WIN!!!!');
                        winner = firstFighter;
                        resolve(winner);
                    }
                    break;

                case controls.PlayerTwoCriticalHitCombination[0]:
                case controls.PlayerTwoCriticalHitCombination[1]:
                case controls.PlayerTwoCriticalHitCombination[2]:
                    if (!secondPlayerCriticalHitCombinationIsActive) {
                        // console.log('Second Fighter Await 10s!!');
                        break;
                    }
                    if (secondPlayerCriticalHitCombination.indexOf(keydown) === -1) {
                        secondPlayerCriticalHitCombination.push(keydown);
                    }
                    if (secondPlayerCriticalHitCombination.length === 3) {
                        // console.log(`Critical DAMAGE -${2 * secondFighter.attack}!`);
                        fistPlayerHealth -= getCriticalDamage(secondFighter);
                        //   console.log(getCriticalDamage(secondFighter));
                        secondPlayerCriticalHitCombination = [];
                        secondPlayerCriticalHitCombinationIsActive = false;
                        setTimeout(() => {
                            secondPlayerCriticalHitCombinationIsActive = true;
                        }, 10000);
                    }
                    if (fistPlayerHealth <= 0) {
                        // console.log('Second Fighter WIN!!!!');
                        winner = secondFighter;
                        resolve(winner);
                    }
                    break;

                default:
                    break;
            }
        }

        function keyupListener(event, playerCriticalHitCombination) {
            const index = playerCriticalHitCombination.indexOf(event.code);
            if (index > -1) {
                playerCriticalHitCombination.splice(index, 1);
            }
        }

        document.addEventListener('keydown', keyCodeListener);
        // document.addEventListener('keyup', keyupListener(event, controls.PlayerOneCriticalHitCombination));
        // document.addEventListener('keyup', keyupListener(event, controls.PlayerTwoCriticalHitCombination));

        document.addEventListener('keyup', event => {
            keyupListener(event, controls.PlayerOneCriticalHitCombination);
        });

        document.addEventListener('keyup', event => {
            keyupListener(event, controls.PlayerTwoCriticalHitCombination);
        });
    });
}
