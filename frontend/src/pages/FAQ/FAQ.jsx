import React, {useState} from "react";

import './FAQ.css';
import { DataF } from "@react-google-maps/api";

 
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const faqData = [
        { question: "What is Chulesi?", answer: "Chulesi is a food delivery service that delivers food to your door from the best local restaurants." },
        { question: "How can I place an order?", answer: "You can place an order via our mobile app or website. Just search for your favorite food and place the order." },
        { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, online banking, and cash on delivery." },
        { question: "Can I track my order?", answer: "Yes, you can track your order in real-time using our app's tracking feature." },
        { question: "What happens if my order is wrong?", answer: "If your order is incorrect, please contact our support team immediately, and we’ll help resolve the issue." }
      ];


      return (
        <div className="faq-container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqData.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3 className="faq-question" onClick={() => toggleQuestion(index)}>{faq.question}</h3>
                        {openIndex === index && <p className="faq-answer">{faq.answer}</p>}

                    </div>
                ))}
            </div>
        </div>
      )

}

export default FAQ;