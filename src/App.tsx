import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/template/MainLayout.tsx";
import { Dashboard } from "./components/pages/Dashboard/Dashboard.tsx";
import { navigation } from "./common/enums/navigation.ts";
import {CreateToken} from "./components/pages/Token/CreateToken/CreateToken.tsx";
import {MyTokens} from "./components/pages/Token/MyTokens/MyTokens.tsx";
import {AuctionDetail} from "./components/pages/Auction/AuctionDetail.tsx";
import CreateAuction from "./components/pages/Auction/CreateAuction/CreateAuction.tsx";
import {MyAuctions} from "./components/pages/Auction/MyAuctions/MyAuctions.tsx";

const queryClient = new QueryClient();

const App = () => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path={navigation.base} element={<Dashboard />} />
                        <Route path={navigation.token} element={<Dashboard />} />
                        <Route path={navigation.auction} element={<AuctionDetail />} />
                        <Route path={navigation.auctions} element={<Dashboard />} />
                        <Route path={navigation.tokens} element={<Dashboard />} />
                        <Route path={navigation.myTokens} element={<MyTokens />} />
                        <Route path={navigation.myAuctions} element={<MyAuctions />} />
                        <Route path={navigation.createAuction} element={<CreateAuction />} />
                        <Route path={navigation.createToken} element={<CreateToken />} />
                    </Route>
                </Routes>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default App;
