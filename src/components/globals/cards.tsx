import clsx from "clsx";
import React, { ReactNode, CSSProperties } from "react";

export const GlassCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "w-full p-5 box-border blur-[11.9] border border-[#FFFFFF33] rounded-[22px] relative",
        className
      )}
      style={{
        background:
          "linear-gradient(161deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 101.7%)",
      }}
    >
      <div className="relative z-20">
        {children}
      </div>

      <div className="bg-[#7371FC80] blur-[50px] rounded-[75px] w-[131px] h-[62px] absolute left-[50%] top-[50%] z-10 translate-x-[-50%] translate-y-[-50%]"></div>
    </div>
  );
};

export const PurpleCard = ({
  head,
  value,
  className,
  style,
}: {
  head: string;
  value: number;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={clsx(
        "w-full p-6 bg-[#7371FC] box-border border border-[#0037FE0F] rounded-[24px] flex items-center justify-between",
        className
      )}
      style={style}
    >
      <div>
        <div className="text-sm">Total</div>
        <div className="text-[28px] font-bold">{head}</div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold flex items-center justify-center w-[70px] h-[70px] rounded-full border-[4px] border-white">{value}</div>
    </div>
  );
};