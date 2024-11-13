// This component is the card of the one single review
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"

import { ReviewsWithUser } from "@/lib/infer-type"
import { motion } from "framer-motion"
import { Card } from "../ui/card"
import Image from "next/image"
import { formatDistance, subDays } from 'date-fns'
import Stars from "./stars"

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
    return (
        <motion.div className="flex flex-col gap-4">
            {reviews.length === 0 && <p className="py-2 text-md font-medium">No reviews yet</p>}
            {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                    <div className="flex gap-2 items-center">
                        <Image className="rounded-full" src={review.user?.image!} width={32} height={32} alt={review.user.name!} />
                        <div>
                            <p className="text-sm font-bold">{review.user.name}</p>
                            <div className="flex items-center gap-2">
                                {/* star componanet */}
                                <Stars rating={review.rating} />
                                {/* display when the review was added. we will use date-fns */}
                                <p className="text-xs text-bold text-muted-foreground">{formatDistance(subDays(review.created!, 0), new Date())}</p>
                            </div>
                        </div>
                    </div>
                    {/* reviews comment */}
                    <p className="py-2 font-medium">{review.comment}</p>
                </Card>
            ))}
        </motion.div>
    )
}