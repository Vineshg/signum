import './style.scss';
import React, { useState, useEffect } from 'react';
import { IOption } from '../../interfaces/IOption';
import { motion, useAnimation } from 'framer-motion';
import { useChat } from '../chat-context/ChatContext';

export default function ChatBody() {

    // Attributes
    const { isOpen, closeChat, config, defaultOption } = useChat();

    const apparitionAnimation = useAnimation();
    const apparitionHeaderAnimation = useAnimation();
    const apparitionBodyAnimation = useAnimation();
    const apparitionFooterAnimation = useAnimation();
    const [option, setOption] = useState<IOption>(defaultOption);
    const [steps, setSteps] = useState<IOption[]>([]);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isDone, setIsDone] = useState(false);

    // Effects
    useEffect(() => {
        if (!isOpen) {
            outSequence();
        } else {
            inSequence();
        }
    }, [isOpen])

    // Methods
    async function inSequence() {
        apparitionAnimation.start({ scaleY: 0, opacity: 0, x: 0, transition: { duration: 0 } });
        apparitionAnimation.start({ opacity: 1, scaleY: 1 });
        apparitionHeaderAnimation.start({ opacity: 1, y: 0, transition: { delay: 0.2 } });
        apparitionBodyAnimation.start({ y: 0, opacity: 1, transition: { delay: 0.2 } });
        apparitionFooterAnimation.start({ y: 0, opacity: 1, scale: 1, transition: { delay: 0.2, ease: "linear" } });
    }

    async function outSequence() {
        await apparitionAnimation.start({ scaleY: 1, opacity: 0, x: 450, transition: { duration: 0.5 } });
        apparitionHeaderAnimation.start({ opacity: 0, y: 10, transition: { duration: 0.3 } });
        apparitionBodyAnimation.start({ y: -10, opacity: 0, transition: { duration: 0.3 } });
        apparitionFooterAnimation.start({ y: 10, opacity: 0, transition: { duration: 0.3, ease: "linear" } });
    }

    function handleOptionClicked(option: IOption) {
        setSteps((steps) => { steps.push(option); return steps; });
        setOption(option);
    }

    function handleBackClicked() {
        // Resets the current values
        setMessage('');
        setEmail('');

        // Sets the current option to the previous one
        if (steps.length >= 2) {
            setOption(steps[steps.length - 2]);
        }
        else {
            setOption(defaultOption);
        }

        // Removes the previous step
        setSteps((steps) => {
            steps.pop();
            return steps;
        });
    }

    async function handleSendClicked() {
        if (isFormFilledIn()) {
            await config.handleSendClicked({ email, message, steps, option });
            setIsDone(true);
        }
    }

    async function handleFinishClicked() {
        await outSequence();
        reset();
        if (config.handleFinalButtonClicked) {
            config.handleFinalButtonClicked();
        }
    }

    /**
     * Returns if the message and e-mail are filled in
     */
    function isFormFilledIn() {
        if (message && email) {
            return true
        }
        return false;
    }

    /**
     * Resets the entire state of the chat
     */
    function reset() {
        setOption(defaultOption);
        setSteps([]);
        setIsDone(false);
        setEmail('');
        setMessage('');
        closeChat();
    }

    // Render
    if (isDone) {
        return (
            <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={apparitionAnimation} className="chat-body-small-container">
                <div className="chat-body-done-title">
                    {config.finalTitle}
                </div>
                <div className="chat-body-done-sub-title">
                    {config.finalSubTitle}
                </div>
                <motion.div onClick={handleFinishClicked} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="chat-body-done-button" style={{ background: config.finalButtonColor }}>
                    {config.finalButtonText}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ scaleY: 0, opacity: 0, x: 500 }} animate={apparitionAnimation} className="chat-body-container">
            <div className="chat-body-header" style={{ background: config.mainColor }}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={apparitionHeaderAnimation}>
                    {
                        option.subTitle ?
                            (
                                <div>
                                    <div className="chat-body-header-title">
                                        {option.title}
                                    </div>
                                    <div className="chat-body-header-body">
                                        {option.subTitle}
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="chat-body-header-small">
                                    <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }} onClick={handleBackClicked} className="chat-body-header-small-image">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.76036 10.388C4.76712 10.3955 4.77411 10.4028 4.78133 10.4101L9.88097 15.5188C10.0316 15.6697 10.0314 15.914 9.88049 16.0646C9.72963 16.2152 9.48525 16.215 9.33465 16.0641L4.23503 10.9554C4.0031 10.7231 3.87334 10.4275 3.84573 10.1242C3.83291 10.0858 3.82597 10.0447 3.82597 10.002C3.82597 9.95954 3.83282 9.91869 3.84548 9.88048C3.8726 9.57589 4.00275 9.27875 4.23591 9.04566L9.34254 3.93958C9.49327 3.78886 9.73765 3.78887 9.88837 3.93961C10.0391 4.09035 10.0391 4.33473 9.88834 4.48545L4.78169 9.59155C4.7737 9.59954 4.766 9.6077 4.75857 9.61602L17.3347 9.61602C17.5479 9.61602 17.7207 9.78883 17.7207 10.002C17.7207 10.2152 17.5479 10.388 17.3347 10.388L4.76036 10.388Z" fill="white" stroke="white" />
                                        </svg>
                                    </motion.div>
                                    <div className="chat-body-header-small-title">
                                        {option.title}
                                    </div>
                                </div>
                            )
                    }
                </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={apparitionBodyAnimation} className="chat-body-content">
                <div className="chat-body-content-message">
                    <img src={config.avatarIcon} className="chat-body-content-message-image" />
                    <div className="chat-body-content-message-body">
                        {option.message}
                    </div>
                </div>

                <div className="chat-body-content-options">
                    {option.options && option.options.map((option) => (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleOptionClicked(option)} className="chat-body-content-option" style={{ background: config.mainColor }}>
                            {option.name}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {
                option.options === undefined ?
                    (
                        <motion.div animate={apparitionFooterAnimation} className="chat-body-messenger">
                            <div className="chat-body-messenger-body">
                                <input autoFocus value={email} onChange={(event) => setEmail(event.target.value)} placeholder={config.emailPlaceholder} />
                                <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={config.messagePlaceholder} />
                            </div>
                            <div className="chat-body-messenger-footer">
                                <motion.div whileHover={{ x: isFormFilledIn() ? 2 : 0 }} whileTap={{ scale: 0.9 }} onClick={handleSendClicked} className="chat-body-messenger-footer-image" style={{ cursor: isFormFilledIn() ? 'pointer' : 'not-allowed' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.0275001 22.8866L2.05466 14.1079C2.13468 13.7344 2.45476 13.4409 2.85485 13.3875L14.1909 12.2135C14.511 12.1868 14.511 11.7065 14.1909 11.6531L2.85485 10.5591C2.45476 10.5324 2.13468 10.2389 2.05466 9.86538L0.0275001 1.11344C-0.159212 0.366318 0.640983 -0.247385 1.33448 0.0994905L23.4999 11.1995C24.1667 11.5464 24.1667 12.507 23.4999 12.8538L1.33448 23.9005C0.640983 24.2474 -0.159212 23.6337 0.0275001 22.8866Z" fill={isFormFilledIn() ? config.sendButtonColor : '#C4C4C4'} />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                    :
                    (
                        <motion.div animate={apparitionFooterAnimation} className="chat-body-footer">
                            {config.footer}
                        </motion.div>
                    )
            }
        </motion.div >
    )
}