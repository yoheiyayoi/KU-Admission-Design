import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="custom-container max-w-3xl! space-y-8" aria-busy="true" aria-label="กำลังโหลดข้อมูลสาขา">
            <div className="max-w-2xl space-y-2">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
                <div className="h-3 w-72 animate-pulse rounded bg-muted" />
            </div>

            <Card className="mx-auto max-w-2xl gap-0 p-0">
                <CardHeader className="h-11 animate-pulse bg-muted" />
                <CardContent className="space-y-4 p-4">
                    <div className="h-9 animate-pulse rounded-lg bg-muted" />
                    <div className="h-9 animate-pulse rounded-lg bg-muted" />
                </CardContent>
            </Card>
        </div>
    )
}
