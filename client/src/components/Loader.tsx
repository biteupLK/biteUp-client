import React from "react";
// import "./Loader.css";
import { CircularProgress, Box } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>

    // old code for loader

    // <div className="loader-container">
    //   {/* <svg className="loader" viewBox="0 0 48 30" width="48px" height="30px">
    //     <g
    //       fill="none"
    //       stroke="currentColor"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       strokeWidth="1"
    //     >
    //       <g transform="translate(9.5,19)">
    //         <circle
    //           className="loader_tire loader-orange"
    //           r="9"
    //           strokeDasharray="56.549 56.549"
    //         ></circle>
    //         <g
    //           className="loader_spokes-spin loader-green"
    //           strokeDasharray="31.416 31.416"
    //           strokeDashoffset="-23.562"
    //         >
    //           <circle className="loader_spokes" r="5"></circle>
    //           <circle
    //             className="loader_spokes"
    //             r="5"
    //             transform="rotate(180,0,0)"
    //           ></circle>
    //         </g>
    //       </g>
    //       <g transform="translate(24,19)">
    //         <g
    //           className="loader_pedals-spin loader-orange"
    //           strokeDasharray="25.133 25.133"
    //           strokeDashoffset="-21.991"
    //           transform="rotate(67.5,0,0)"
    //         >
    //           <circle className="loader_pedals" r="4"></circle>
    //           <circle
    //             className="loader_pedals"
    //             r="4"
    //             transform="rotate(180,0,0)"
    //           ></circle>
    //         </g>
    //       </g>
    //       <g transform="translate(38.5,19)">
    //         <circle
    //           className="loader_tire loader-orange"
    //           r="9"
    //           strokeDasharray="56.549 56.549"
    //         ></circle>
    //         <g
    //           className="loader_spokes-spin loader-green"
    //           strokeDasharray="31.416 31.416"
    //           strokeDashoffset="-23.562"
    //         >
    //           <circle className="loader_spokes" r="5"></circle>
    //           <circle
    //             className="loader_spokes"
    //             r="5"
    //             transform="rotate(180,0,0)"
    //           ></circle>
    //         </g>
    //       </g>
    //       <polyline
    //         className="loader_seat loader-green"
    //         points="14 3,18 3"
    //         strokeDasharray="5 5"
    //       ></polyline>
    //       <polyline
    //         className="loader_body loader-green"
    //         points="16 3,24 19,9.5 19,18 8,34 7,24 19"
    //         strokeDasharray="79 79"
    //       ></polyline>
    //       <path
    //         className="loader_handlebars loader-green"
    //         d="m30,2h6s1,0,1,1-1,1-1,1"
    //         strokeDasharray="10 10"
    //       ></path>
    //       <polyline
    //         className="loader_front loader-green"
    //         points="32.5 2,38.5 19"
    //         strokeDasharray="19 19"
    //       ></polyline>
    //     </g>
    //   </svg> */}
    //   <div className="loader-text">
    //     Almost there... just adding extra napkins!
    //   </div>
    // </div>
  );
};

export default Loader;
