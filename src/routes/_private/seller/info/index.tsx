import { createFileRoute } from '@tanstack/react-router'
import { BasicInfo } from './-components/BasicInfo'
import { ImagesSection } from './-components/ImagesSection'
import { LocationInfo } from './-components/LocationInfo'
import { StatsInfo } from './-components/StatsInfo'
import { ContactInfo } from './-components/ContactInfo'

export const Route = createFileRoute('/_private/seller/info/')({
  component: SellerInfoPage,
})

function SellerInfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <ImagesSection />
        <div className="grid md:grid-cols-2 gap-6">
          <BasicInfo />
          <ContactInfo />
        </div>
        <LocationInfo />
        <StatsInfo />
      </div>
    </div>
  )
}
