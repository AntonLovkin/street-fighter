import controls from '../../constants/controls';

function getRandomNumber(min = 1, max = 2) {
    return Math.random() * (max - min) + min;
}

function getHitPower(attack) {
    const randomNumber = getRandomNumber();
    return attack.attack * randomNumber;
}

function getBlockPower(defense) {
    const randomNumber = getRandomNumber();
    return defense.defense * randomNumber;
}

function getDamage(attacker, defender = null) {
    // const bonusAttack = getHitPower(attacker);
    if (defender === null) return attacker;

    // const defender = getBlockPower(defender);
    if (attacker <= defender) return 0;
    return attacker - defender;
}

// function getDamage(attacker, defender = null) {
//     const bonusAttack = getHitPower(attacker);
//     if (defender === null) return bonusAttack;

//     const bonusDefense = getBlockPower(defender);
//     if (bonusAttack <= bonusDefense) return 0;
//     return bonusAttack - bonusDefense;
// }

export function getCriticalDamage(attacker) {
    return 2 * attacker.attack;
}

export async function fight([firstFighter, secondFighter]) {
    const firstFighterHelthElement = document.getElementById('left-fighter-indicator');
    const secondFighterHelthElement = document.getElementById('right-fighter-indicator');
    const styles = window.getComputedStyle(firstFighterHelthElement);
    const backgroundColor = styles.getPropertyValue('background-color');

    return new Promise(resolve => {
        let winner = null;

        let fistPlayerHealth = firstFighter.health;
        let secondPlayerHealth = secondFighter.health;

        const fistPlayerHealthIndicator = fistPlayerHealth;
        const secondPlayerHealthIndicator = secondPlayerHealth;

        let firstPlayerCriticalHitCombination = [];
        let secondPlayerCriticalHitCombination = [];

        let firstPlayerCriticalHitCombinationIsActive = true;
        let secondPlayerCriticalHitCombinationIsActive = true;

        let fistPlayerMove = '';
        let secondPlayerMove = '';

        const player = {
            left: 'left',
            right: 'right'
        };

        function helthCounter(prev, playerHealthIndicator, playerPosition) {
            if (playerPosition === 'left') {
                const indicatorValue = (prev / playerHealthIndicator) * 100;
                firstFighterHelthElement.style.width = `${indicatorValue}%`;
                firstFighterHelthElement.style.backgroundColor = indicatorValue > 30 ? backgroundColor : 'red';
            }
            if (playerPosition === 'right') {
                const indicatorValue = (prev / playerHealthIndicator) * 100;
                secondFighterHelthElement.style.width = `${indicatorValue}%`;
                secondFighterHelthElement.style.backgroundColor = indicatorValue > 30 ? backgroundColor : 'red';
            }
        }

        function keyCodeListener(e) {
            if (fistPlayerHealth <= 0 || secondPlayerHealth <= 0) return;
            const keydown = e.code;
            switch (keydown) {
                case controls.PlayerOneAttack:
                    fistPlayerMove = 'attack';
                    if (secondPlayerMove === 'attack' || secondPlayerMove === '') {
                        // secondPlayerHealth -= getDamage(firstFighter);
                        secondPlayerHealth -= getDamage(getHitPower(firstFighter), getBlockPower(secondFighter));
                        helthCounter(secondPlayerHealth, secondPlayerHealthIndicator, player.right);
                    }
                    if (secondPlayerMove === 'defense') {
                        // secondPlayerHealth -= getDamage(firstFighter, secondFighter);
                        secondPlayerHealth -= getDamage(getHitPower(firstFighter), getBlockPower(secondFighter));
                        helthCounter(secondPlayerHealth, secondPlayerHealthIndicator, player.right);
                    }
                    if (secondPlayerHealth <= 0) {
                        // console.log('First Fighter WIN!!!!');
                        winner = firstFighter;
                        resolve(winner);
                    }
                    break;

                case controls.PlayerTwoAttack:
                    secondPlayerMove = 'attack';
                    if (fistPlayerMove === 'attack' || fistPlayerMove === '') {
                        // fistPlayerHealth -= getDamage(secondFighter);
                        fistPlayerHealth -= getDamage(getHitPower(secondFighter), getBlockPower(firstFighter));
                        helthCounter(fistPlayerHealth, fistPlayerHealthIndicator, player.left);
                    }
                    if (fistPlayerMove === 'defense') {
                        // fistPlayerHealth -= getDamage(secondFighter, firstFighter);
                        fistPlayerHealth -= getDamage(getHitPower(secondFighter), getBlockPower(firstFighter));
                        helthCounter(fistPlayerHealth, fistPlayerHealthIndicator, player.left);
                    }
                    if (fistPlayerHealth <= 0) {
                        // console.log('Second Fighter WIN!!!!');
                        winner = secondFighter;
                        resolve(winner);
                    }
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
                        helthCounter(secondPlayerHealth, secondPlayerHealthIndicator, player.right);
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
                        helthCounter(fistPlayerHealth, fistPlayerHealthIndicator, player.left);
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

        document.addEventListener('keydown', keyCodeListener);

        function keyupListener(event, playerCriticalHitCombination) {
            const index = playerCriticalHitCombination.indexOf(event.code);
            if (index > -1) {
                playerCriticalHitCombination.splice(index, 1);
            }
        }

        document.addEventListener('keyup', event => {
            keyupListener(event, controls.PlayerOneCriticalHitCombination);
        });

        document.addEventListener('keyup', event => {
            keyupListener(event, controls.PlayerTwoCriticalHitCombination);
        });
    });
}
