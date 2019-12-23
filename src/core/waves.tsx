import React from 'react'

export const Waves = ({
  height,
  width,
  scale,
}: {
  height: number
  width: number
  scale: number
}) => {
  const clipRef = React.useRef<SVGClipPathElement>(null)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <clipPath
          clipPathUnits="objectBoundingBox"
          ref={clipRef}
          transform={`matrix(0.01 0 0 0.01 0 0)`}
          id="wave1"
        >
          <path>
            <animate
              id="anim1"
              dur="5s"
              begin="0s"
              repeatCount="indefinite"
              attributeName="d"
              values={`
                m79.090077,13.191808c11.764243,-0.893401 10.65096,17.470965 12.229495,28.30766c1.578535,10.836697 0.681263,34.140754 -4.28697,43.936839c-4.968232,9.796087 -14.007425,6.102147 -23.428789,9.869873c-9.43798,3.785668 -21.252071,-0.813133 -31.221769,-4.652626c-9.986313,-3.857433 -17.114647,1.234579 -22.332122,-8.23856c-5.217475,-9.491081 -7.693283,-29.630291 -5.49995,-40.520812c2.176717,-10.890521 1.545303,-24.621572 9.454596,-31.188179c7.909293,-6.566608 24.359294,-5.968774 34.511769,-6.202013c10.135859,-0.233241 18.809496,9.581219 30.573738,8.687817z;
                m79.09008,13.19181c11.26447,2.10527 13.64962,17.97074 12.22949,28.30766c-1.42013,10.33692 -1.56774,31.14208 -6.53597,40.93817c-4.96823,9.79608 -11.50853,12.09948 -21.17979,12.86854c-9.67126,0.76906 -21.23546,-5.04331 -31.22177,-4.65263c-9.98631,0.39068 -17.11464,1.23458 -22.33212,-8.23856c-5.21747,-9.49108 -3.69506,-29.63029 -5.49995,-40.52081c-1.80489,-10.89052 5.29364,-21.12313 13.20293,-27.68974c7.90929,-6.5666 20.61096,-9.46721 30.76344,-9.70045c10.13586,-0.23324 19.30927,6.58255 30.57374,8.68782z;
                m79.090077,13.191808c11.764243,-0.893401 10.65096,17.470965 12.229495,28.30766c1.578535,10.836697 0.681263,34.140754 -4.28697,43.936839c-4.968232,9.796087 -14.007425,6.102147 -23.428789,9.869873c-9.43798,3.785668 -21.252071,-0.813133 -31.221769,-4.652626c-9.986313,-3.857433 -17.114647,1.234579 -22.332122,-8.23856c-5.217475,-9.491081 -7.693283,-29.630291 -5.49995,-40.520812c2.176717,-10.890521 1.545303,-24.621572 9.454596,-31.188179c7.909293,-6.566608 24.359294,-5.968774 34.511769,-6.202013c10.135859,-0.233241 18.809496,9.581219 30.573738,8.687817z;
            `}
            />
          </path>
        </clipPath>
      </defs>
    </svg>
  )
}