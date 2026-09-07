import { useEffect, useRef, useState } from 'react';
import { row1Images, row2Images } from '../data/marqueeImages';

function tripled(images: string[]) {
  return [...images, ...images, ...images];
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const value = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(value);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1 = tripled(row1Images);
  const row2 = tripled(row2Images);

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="flex flex-col gap-3">
        <div
          className="flex gap-3"
          style={{ transform: `translateX(${offset - 200}px)`, willChange: 'transform' }}
        >
          {row1.map((src, i) => (
            <img
              key={`row1-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="rounded-2xl object-cover flex-shrink-0"
              style={{ width: 420, height: 270 }}
            />
          ))}
        </div>
        <div
          className="flex gap-3"
          style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}
        >
          {row2.map((src, i) => (
            <img
              key={`row2-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="rounded-2xl object-cover flex-shrink-0"
              style={{ width: 420, height: 270 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
