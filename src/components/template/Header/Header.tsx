import {useAccount,  useConnect, useDisconnect} from "wagmi";
import { Icons } from "../../ui/icons/Icons.ts";
import Button from "../../ui/Button";
import Wrapper from "../../ui/Wrapper/Wrapper.tsx";
import {useState} from "react";
import {NavLink} from "react-router-dom";
import { navigation } from "../../../common/enums/navigation.ts";



export const Header = () => {
    const { address, isConnected } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => setIsOpen(!isOpen);
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();




    return <header className={'mb-12'}>
        <Wrapper>
        <div className="py-4 flex items-center justify-between relative">
            <div className={"flex gap-5 items-center"}>
            <NavLink to={navigation.base}>
                <h1>
                    Auction
                </h1>
            </NavLink>
                <span className={'w-[1px] bg-white/70 h-5 inline-block'}/>
                <NavLink className={"[&.active]:bg-white/10 px-2 py-1  rounded-md"} to={navigation.createToken}>
                    Create Token
                </NavLink>
                <NavLink className={"[&.active]:bg-white/10 px-2 py-1  rounded-md"} to={navigation.createAuction}>
                    Create Auction
                </NavLink>
            </div>
            <div className="flex items-center justify-center gap-3">
                {isConnected ? (
                    <>
                        <Button  onClick={() => togglePopup()} >
                            <div className={"flex items-center justify-center gap-3"}>
                            <Icons.metamask className={"w-4 h-4"}/>
                                <span className={"max-w-24 truncate"}>
                                    {address}
                                </span>
                            </div>
                        </Button>

                        <div className={`${isOpen ? "max-h-[200px]": "max-h-[0]"} absolute overflow-hidden max-w-[200px] w-full transition-all bg-[#4B4B4B] rounded-md  bottom-[-120px] right-0`}>
                            <div className={"flex-col flex items-center justify-between p-3 gap-2"}>
                                <NavLink to={navigation.myTokens}>
                                    My Tokens
                                </NavLink>
                                <NavLink to={navigation.myAuctions}>
                                    My Auctions
                                </NavLink>
                            <Button className={'w-full bg-[#993F3F]'} onClick={() => disconnect()}>Disconnect</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <Button   onClick={() => connect({connector: connectors[0]})}>
                        <div className={"flex items-center justify-center gap-3"}>
                            <Icons.metamask className={"w-4 h-4"}/>
                            Connect Wallet
                        </div>
                    </Button>
                )}
            </div>
        </div>
        </Wrapper>
    </header>
}