import showModal from './modal';
// import App from '../../app';

export default function showWinnerModal(fighter) {
    // call showModal function
    const { name } = fighter;
    const data = {
        title: `Winner: ${name}`,
        bodyElement: 'Try next Hero!!!',
        onClose() {
            const root = document.getElementById('root');
            root.innerHTML = '';
            // App.startApp();
        }
    };
    showModal(data);
}
