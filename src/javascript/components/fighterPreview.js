import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    // console.log('createFighterImage',fighter)
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

// function createFighterInfo(fighter) {
//     const { name, health, attack, defense } = fighter;
//     const nameElement = createElement({
//         tagName: 'h2',
//         className: 'fighter-preview___name',
//         // attributes
//     });
//     nameElement.innerHTML = name;
//     return nameElement;
// }

function createFighterName(fighter) {
    const { name } = fighter;
    const nameElement = createElement({
        tagName: 'h2',
        className: 'fighter-preview___name'
        // attributes
    });
    nameElement.innerHTML = name;
    return nameElement;
}

function createFighterHealth(fighter) {
    const { health } = fighter;
    const healthElement = createElement({
        tagName: 'span',
        className: 'fighter-preview___health'
    });
    healthElement.innerHTML = `Health: ${health}`;
    return healthElement;
}

function createFighterAttack(fighter) {
    const { attack } = fighter;
    const attackElement = createElement({
        tagName: 'span',
        className: 'fighter-preview___attack'
    });
    attackElement.innerHTML = `Attack: ${attack}`;
    return attackElement;
}

function createFighterDefense(fighter) {
    const { defense } = fighter;
    const defenseElement = createElement({
        tagName: 'span',
        className: 'fighter-preview___defense'
    });
    defenseElement.innerHTML = `Defense: ${defense}`;
    return defenseElement;
}

export function createFighterPreview(fighter, position) {
    // console.log(fighter)
    if (!fighter) return;
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    // console.log('createFighterPreview',fighter)

    const fighterImage = createFighterImage(fighter);
    const fighterName = createFighterName(fighter);
    const fighterHealth = createFighterHealth(fighter);
    const fighterAttack = createFighterAttack(fighter);
    const fighterDefense = createFighterDefense(fighter);

    // зробити деструктуризацію з одного масива створених елементів
    fighterElement.append(fighterImage, fighterName, fighterHealth, fighterAttack, fighterDefense);

    return fighterElement;
}
