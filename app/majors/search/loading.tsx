import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="custom-container max-w-3xl! space-y-8" aria-busy="true" aria-label="กำลังค้นหาสาขา">
            <div className="max-w-2xl space-y-2">
                <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
            </div>

            <Card className="mx-auto max-w-3xl p-0">
                <CardContent className="space-y-3 p-4 sm:p-5">
                    <div className="h-9 animate-pulse rounded-lg bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </CardContent>
            </Card>

            <div className="mx-auto max-w-3xl space-y-4">
                {[0, 1, 2].map((item) => (
                    <div key={item} className="h-32 animate-pulse rounded-xl bg-muted" />
                ))}
            </div>
        </div>
    )
}
