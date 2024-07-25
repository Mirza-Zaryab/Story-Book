import NavBar from '../../components/NavBar';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import Footer from '../../components/Footer';
import './style.css';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {

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
                            Privacy Policy
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white flex justify-center items-center h-52">
                <img src={MSVLogo} alt="My Story Vault" />
            </div>
            <div className=" bg-white">
                
                <div className="mx-6 sm:mx-28 pt-4">
                    <h3 className="font-serif text-2xl  font-semibold flex justify-center">MY STORY VAULT PRIVACY POLICY</h3>
                    <p className="font-serif  mt-8 text-lg">
                    My Story Vault LLC operates the <Link to={"/"}><a className="text-blue-500 border-b-2">www.mystoryvault.co</a></Link> which provides the SERVICE. This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if a visitor decides to use our Services, the My Story Vault website.
                    <br/>
                    <br/>
                    If you choose to use our Services, then you agree to the collection and use of information in relation with this policy. The personal information that we collect is used for providing and improving the Services. We will not use or share your information with anyone except as described in this Privacy Policy. The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at www.mystoryvault.co, unless otherwise defined in this Privacy Policy.

                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">INFORMATION COLLECTION AND USE</h3>
                    <p className="font-serif  mt-4 text-lg">
                    For a better experience while using our Services, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.

                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    LOG DATA
                    </h3>
                    <p className="font-serif  mt-4 text-lg">
                    We want to inform you that whenever you visit our Services, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser version, pages of our Services that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    COOKIES
                    </h3>
                    <p className="font-serif  mt-4 text-lg">
                    Cookies are files with a small amount of data that is commonly used as an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive.Our website uses these “cookies” to collect information and to improve our Services. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Services.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        Can I add on to or edit the content of my book?
                    </h3>
                    <p className="font-serif  mt-4 text-lg">
                        Yes. You may edit and add to the content of your book in the text editor. You may
                        reorder chapters or questions by simply clicking and dragging, and you may redesign your
                        book cover at any time.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    SERVICE PROVIDERS
                    </h3>
                    <p className="font-serif  mt-4 text-lg">
                    We may employ third-party companies and individuals due to the following reasons:
                    </p>
                    <ul className='p-6 space-y-2 space-x-4 list-disc'>
                        <li className=" font-serif text-lg list-none"></li>
                        <li className=" font-serif text-lg">To facilitate our Services;</li>
                        <li className=" font-serif text-lg">To provide the Services on our behalf;</li>
                        <li className=" font-serif text-lg">To perform Services-related services; or</li>
                        <li className=" font-serif text-lg">To assist us in analyzing how our Services are used.</li>
                    </ul>
                    <p className="font-serif text-lg">
                    We want to inform our Services users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">SECURITY</h3>
                    <p className="font-serif  mt-4 text-lg">
                    We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.

                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    LINKS TO OTHER SITES
                    </h3>
                    <p className="font-serif mt-4 text-lg">
                    Our Services may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl font-semibold italic">CHILDREN’S PRIVACY</h3>
                    <p className="font-serif  mt-4 text-lg">
                    Our Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please <Link to={"/contact"}><a className='text-blue-500 border-b-2'>contact us</a></Link> so that we will be able to do necessary actions.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8 pb-10">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    CHANGES TO THIS PRIVACY POLICY
                    </h3>
                    <p className="font-serif   mt-4 text-lg">
                    We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.

                    </p>
                </div>
                <div className="mx-6 sm:mx-28 mt-8 pb-10">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                    CONTACT US
                    </h3>
                    <p className="font-serif   mt-4 text-lg">
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to <Link to={"/contact"}><a className='text-blue-500 border-b-2'>contact us</a></Link>.
                    </p>
                </div>
            </div>
            <div className="">
                <Footer />
            </div>
        </>
    );
}