import Wrapper from "../../ui/Wrapper";

export const Footer = () => {
    return (
        <footer className=" py-4">
            <Wrapper>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Your company. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </Wrapper>
        </footer>
    );
};
