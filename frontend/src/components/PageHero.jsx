export default function PageHero({ title, subtitle, image, badge, children }) {
  return (
    <section
      className="page-hero"
      style={{ backgroundImage: image ? `url(${image})` : undefined, background: image ? undefined : 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#FF9700', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#30D5C8', transform: 'translate(-30%, 30%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
            {badge}
          </div>
        )}
        <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}