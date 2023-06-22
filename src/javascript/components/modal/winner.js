import showModal from './modal';
import createElement from '../../helpers/domHelper';
// import App from '../../app';

export default function showWinnerModal(fighter) {
    // call showModal function
    const { name, source } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const winnerImg = createElement({ tagName: 'img', className: 'modal-img', attributes });

    const data = {
        title: `Winner: ${name}`,
        bodyElement: winnerImg,
        onClose() {
            const root = document.getElementById('root');
            root.innerHTML = '';
            // App.startApp();
        }
    };
    showModal(data);
}
