export default function SectionTitle({ title, subtitle, center = true, light = false }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <h2 className={`font-montserrat font-black text-3xl md:text-4xl mb-3 ${light ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      <div className={`h-1 w-12 bg-orange rounded-full ${center ? 'mx-auto' : ''} mb-4`} />
      {subtitle && (
        <p className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}