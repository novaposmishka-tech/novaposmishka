import { RatingBadge } from "@/components/elementary/RatingBadge"

export default function RatingSection() {
  return (
    <div className="flex flex-wrap items-start gap-10">
      <RatingBadge label="Рейтинг Google" score={4.8} />
      <RatingBadge label="Половина зірки округлюється вгору" score={3.5} />
      <RatingBadge label="Максимум" score={5} />
    </div>
  )
}
