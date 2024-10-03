'use client';

import styles from '../style/style.module.css';

interface props {
    show: boolean;
    closeModal: () => void;
}

export default function Modalpopup(props: props) {

    return (
        <div className={props.show ? styles.modalPopup  : "modal hidden"}>        
            <section className="modal-main">
                <button className="close-button" onClick={props.closeModal}>X</button>
                <h2>Invoice Submitted Successfully!</h2>
                <p>Your invoice has been submitted successfully.</p>
            </section>
        </div>
    )
}
