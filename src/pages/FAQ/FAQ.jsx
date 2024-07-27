import NavBar from '../../components/NavBar';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import Footer from '../../components/Footer';

import './style.css';

export default function FAQ() {
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
                            Frequently Asked Questions
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white flex justify-center items-center h-52">
                <img src={MSVLogo} alt="My Story Vault" />
            </div>
            <div className=" bg-white">
                <div className="mx-6 sm:mx-28">
                    <h3 className="font-serif text-2xl  font-semibold italic">What is My Story Vault?</h3>
                    <p className="font-serif  mt-8">
                        My story vault is a software platform developed specifically to make writing the stories
                        of your life simple. My Story Vault provides a custom design process tailored to your
                        needs, your timeline, and your storytelling style.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">How long will it take?</h3>
                    <p className="font-serif  mt-8">
                        It's up to you. My Story Vault will help you create your chapters and questions for the
                        content of your book, the speed with which you finish is in your control.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        How many paragraphs should I include for each question?
                    </h3>
                    <p className="font-serif  mt-8">
                        Our questions have been created to help spark memories and inspire you to develop your
                        story. They can be as concise or lengthy as your storytelling allows. We encourage our
                        writers to be honest and authentic. A memoir is about your personal experiences, so be
                        honest and authentic in your storytelling. Share both your successes and failures,
                        strengths and vulnerabilities. This will make your memoir relatable and compelling.
                        Consider how you have grown and transformed throughout your life, lessons you've
                        learned, challenges you've overcome, and the insights you've gained. This will give your
                        memoir depth and resonance.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        Can I upload photos to my book?
                    </h3>
                    <p className="font-serif  mt-8">
                        Yes, photos in Jpeg and PNG format may be uploaded to our automated cropping tool. There is no limit
                        on photos as long as the page count of your book is 300 pages or less. You may also
                        create captions for each photo.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        Can I add on to or edit the content of my book?
                    </h3>
                    <p className="font-serif  mt-8">
                        Yes. You may edit and add to the content of your book in the text editor. You may
                        reorder chapters or questions by simply clicking and dragging, and you may redesign your
                        book cover at any time.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        What is included for my purchase of $139.00?
                    </h3>
                    <p className="font-serif  mt-8">
                        Custom book cover design, access to chapter and question prompts (over 600). One
                        hardcover, color 6x9 book and a PDF of your book and book cover.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">Can I purchase extra books?</h3>
                    <p className="font-serif  mt-8">
                        Extra Books are $79 each. We strongly encourage you to print one book and check for any
                        errors before ordering additional copies.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        Can I invite collaborators to help write the book?
                    </h3>
                    <p className="font-serif  mt-8">
                        Collaborations are encouraged. We created My Story Vault with the purpose of bringing
                        others together, simply click on the collaboration project to create the book and invite
                        others to help you. They will be sent an email link to join in the book creation.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8">
                    <h3 className="font-serif text-2xl font-semibold italic">Is there a deadline?</h3>
                    <p className="font-serif  mt-8">
                        Once you make your purchase you will have all the time you need to finish. No deadline,
                        unless you choose it. We created a dashboard with a deadline calculator to help keep you
                        on track if you so choose.
                    </p>
                </div>

                <div className="mx-6 sm:mx-28 mt-8 pb-10">
                    <h3 className="font-serif text-2xl  font-semibold italic">
                        How long does it take to ship?
                    </h3>
                    <p className="font-serif   mt-8">
                        We recommend you place your book order 3 weeks prior to the date you need it in order to
                        ensure on time shipping.
                    </p>
                </div>
            </div>
            <div className="">
                <Footer />
            </div>
        </>
    );
}