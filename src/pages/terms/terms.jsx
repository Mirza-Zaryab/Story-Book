import NavBar from '../../components/NavBar';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import Footer from '../../components/Footer';

import './style.css';
import { useEffect } from 'react';

export default function Terms() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return (
        <>
            <div className="bg-gray-100 h-full">
                <div className="flex h-full">
                    <div className="nav">
                        <NavBar />
                    </div>
                </div>
                <div className="flex-1 pt-32 p-8" style={{ backgroundColor: '#9fc8b8' }}>
                    <div className="max-w-lg mx-auto">
                        <div className="text-xl sm:text-3xl font-serif text-center font-semibold mb-4">
                            Terms & Conditions
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white flex justify-center items-center h-52">
                <img src={MSVLogo} alt="My Story Vault" />
            </div>
            <div className=" bg-white pb-20">
                <div className="mx-6 sm:mx-28">
                    <p className="font-serif text-xl text-justify">
                        <b>My Story Vault LLC</b> is a web application that helps you write the stories of your life. You own the content. My Story Vault proprietary software helps you plan, create, edit and print and/or download the pdf of the stories that you have written. We appreciate your desire to use My Story Vault to create a living history. You will be using <b>www.mystoryvault.co</b>, hereinafter referred to as “Website”. This Website is the property of My Story Vault LLC, hereinafter referred to as “The Company”. The use of this Website and its related services and products is subject to the following Terms and Conditions. Please read them carefully. If you do not agree with any of the following terms and conditions, please do not access or otherwise use this Website or any information contained herein.
                    </p>

                </div>

                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">1. Conditions of Use</h3>
                    <h3 className="font-serif text-2xl text-gray-600 ml-8">1.1 License</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                        Subject to your compliance to these Terms and Conditions, The Company grants you a limited, non-exclusive, non-transferable license to access and make use of this Website and the material that is available for personal noncommercial use only. Any unauthorized use of this Website shall result in an automatic termination of the license granted pursuant to this section.
                        <br/>By submitting Personal Information through our Website, you indicate your agreement to these Terms and Conditions.
                    </p>
                    <h3 className="font-serif text-2xl text-gray-600 ml-8 mt-1">1.2. User’s Conduct</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                        You may access this Website only for the purpose of evaluating, creating and ordering The Company’s products and services, hereinafter referred to as “Products”.By using this Website, you agree not to upload, download, email, post or otherwise transmit or use any content – including but not limited to text, data, pictures, graphics (hereinafter, “Content) – that may be unlawful, harmful, threatening, defamatory or pornographic or otherwise in violation of provisions of laws. You further agree not to upload, download, email, post or otherwise transmit or use any Content that may infringe any patent, trademark, trade secret, copyright or other proprietary right of any party.
                        Notwithstanding any of the foregoing, you acknowledge that The Company does not in any way control or pre-screen any Content you may transmit or use through this Website, nor correct any grammatical errors, typos and the like, and you remain solely responsible for such
                        Content.
                        You further acknowledge that The Company may store any Content you upload on this Website for the purpose of creating your products.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">2. Copyright</h3>
                    <p className="font-serif mt-1 text-xl ml-8">
                    All features and content of this Website, including but not limited to text, images, screen interfaces, design and software, are copyrighted by The Company or its licensors. You agree not to publish, reproduce, copy or download, in whole or in part, any features and content included in this Website, in violation of copyright and intellectual property law.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">3. Trademarks</h3>
                    <p className="font-serif mt-1 text-xl ml-8">
                    All features and content of this Website, including but not limited to text, images, screen interfaces, design and software, are copyrighted by The Company or its licensors. You agree not to publish, reproduce, copy or download, in whole or in part, any features and content included in this Website, in violation of copyright and intellectual property law.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">4. Conditions of Purchase</h3>
                    <h3 className="font-serif text-2xl text-gray-600 ml-8">4.1. Purchases</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                        By placing an order on this Website, you represent that the Products ordered will be used only in a lawful manner. Products purchased on the Website are intended for personal use only and shall not be published or commercially exploited in any way.The Company uses an online credit card processing partner and does not maintain any credit card information on The Company’s Website or in any database. Your order is final and binding upon valid processing of your payment. Once the Product is paid for, you cannot change or modify your order in any way.
                    </p>
                    <h3 className="font-serif text-2xl text-gray-600 ml-8 mt-1">4.2. Pricing and shipping</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                    Prices and shipping costs are indicated in U.S. Dollars, including taxes if applicable. Standard shipping cost of one book is included in the initial payment. Expedited shipping is an additional cost paid at print checkout. Additional copies of your memoir are charged per book, ordered at print checkout. The Company reserves the right to modify the prices of the Products and/or shipping costs at any time and at its discretion, without any further notification, except from that which is included on the Website. However, ordered Products are always priced on the basis of rates applicable at the time of paying for the finished Product. You acknowledge that the Products are manufactured and delivered by independent contractors selected by The Company. The Company shall use its best effort to have the Products delivered to you in a timely manner. However, printing and delivery times, as shown in your order confirmation are indicative and may not be guaranteed, as they may be affected by factors beyond The Company’s control.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">5. User’s representations and warranties</h3>
                    <h3 className="font-serif text-2xl ml-8 mt-1">You represent and warrant that:</h3>
                    <p className="font-serif  text-xl ml-16 text-justify mt-2">
                        1.  You are at least 18 years old or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these terms and conditions;
                    </p>
                    <p className="font-serif  text-xl ml-16 text-justify mt-4">
                        2. You own the Content you upload, download, email, post or otherwise transmit to this Website or you are duly authorized to do so by the Client's rights holder;
                    </p>
                    <p className="font-serif mt-4 text-xl ml-16 text-justify">
                        3. The Content does not infringe any intellectual property rights or any other rights of others.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">6. Indemnity</h3>
                    <p className="font-serif mt-1 text-xl ml-8  text-justify">
                    You agree to defend, indemnify and hold The Company and its officers, directors, coworkers and employees harmless against any liability, damage or loss suffered by The Company arising out of or anyway based on (i) your breach of the above representations; (ii) your use of this Website in any violation of these Terms and Conditions; (iii) your violation of any rights of third parties; (iv) any unauthorized access to or use of The Company’s secure servers and/or any personal data stored therein imputable to you.

                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">7. Disclaimer of Warranties</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                        This Website is provided by The Company on an “as is” and “as available” basis.To the fullest extent permissible pursuant to applicable law, The Company expressly disclaims any representations or warranties of any kind, expressed or implied, including but not limited to warranties of title, or implied warranties of merchantability and fitness for a particular purpose, with regard to the operation of this Website as well as to the information, content and materials included herein.
                        The Company assumes no responsibility for and makes no warranty or representation as to the accuracy, completeness, reliability, legitimacy or usefulness of any third party’s link, trademark, content, product, service or information contained in this Website. You expressly agree that your use of this Website is at your sole risk. The Company reserves the right to modify this Website and all items and information contained herein at any time and at its discretion without any further notification.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">8. Limitation of liabilities</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                        The Company shall not be liable for any direct, indirect, incidental, consequential, punitive or moral damages, including but not limited to damages for loss of profits, goodwill, data or business, resulting from (i) any unauthorized use of this Website, in violation of these Terms and Conditions, or your inability to use this Website; (ii) any virus, bugs and the like that may be transmitted to or through this Website; (iii) any interruption of services, errors or omissions related to this Website; (iv) any mispacking and mis-shipment of the Products, or any delayed or failed delivery.
                        In any case, The Company’s liability is limited to the amount paid for the Products purchased in this Website and specifically related to the claim set forth, which shall clearly indicate the purchase order and invoice number.

                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">9. Jurisdiction and Governing Law</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                    This Agreement shall be governed by the laws of the State of Arizona without giving effect to any conflict of laws principles that may provide the application of the law of another jurisdiction.
                    </p>
                </div>
                <div className="mx-6 sm:mx-40 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold">10. Amendments</h3>
                    <p className="font-serif mt-1 text-xl ml-8 text-justify">
                    The Company reserves the right to amend these Terms and Conditions at any time and at its discretion without further notification.
                    </p>
                </div>

            </div>
            <div className="">
                <Footer />
            </div>
        </>
    );
}