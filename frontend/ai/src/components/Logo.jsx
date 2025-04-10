import React from "react";
import Image from "next/image";

function Logo() {
    return (
        <div className="flex items-center  h-16 text-black mb-8 mr-20">
            <Image
                alt={"Logo"}
                src={`/HCMUS_Icon.png`} 
                width={128}
                height={128}
                className="rounded-md flex mr-8"
            />
            <span className="text-4xl font-bold">AIO_WAO</span>
        </div>
    );
}

export default Logo;