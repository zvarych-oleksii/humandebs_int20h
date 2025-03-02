import { Link } from "react-router-dom";
import { Card } from "../../ui/Card/Card.tsx";
import { AuctionTypes } from "../../../common/enums/auctionTypes.ts";
import { navigation } from "../../../common/enums/navigation.ts";
import { BackendEvent } from "../../../lib/types/general.ts";
import { Auction } from "../../../lib/types/auction.ts";

type AuctionListProps = {
    auctions: BackendEvent<Auction>[];
};

export const AuctionList = ({ auctions }: AuctionListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-auto gap-8">
            {auctions.map((auctionEvent, index) => (
                <Card
                    key={index}
                    className="hover:scale-105 transition-transform bg-white/5 duration-200 border border-white/20"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                        {`${(Number(auctionEvent.args.tokenAmount) / 1e18).toFixed(2)} $${auctionEvent.args.token.ticker}`}
                    </h2>
                    <div className="space-y-2 text-gray-200">
                        <p title={auctionEvent.args.owner}>
                            <span className="font-medium">Owner:</span>{" "}
                            <span className="block truncate">{auctionEvent.args.owner}</span>
                        </p>
                        <p title={auctionEvent.args.auctionType.toString()}>
                            <span className="font-medium">Type:</span>{" "}
                            <span className="block truncate">
                                {AuctionTypes[auctionEvent.args.auctionType]}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span className="block truncate">
                                {auctionEvent.args.ended ? "Ended" : "Active"}
                            </span>
                        </p>
                    </div>
                    <div className="mt-4 text-center">
                        <Link
                            to={navigation.auction.replace(':id', auctionEvent.args.auctionAddress)}
                            state={{ type: auctionEvent.args.auctionType }}
                            className="inline-block px-4 py-2 bg-white/30 text-white rounded hover:bg-white/50 transition-colors shadow-md"
                        >
                            View Details
                        </Link>
                    </div>
                </Card>
            ))}
        </div>
    );
};
