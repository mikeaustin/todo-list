import React from "react";
import type { NhostClient } from "@nhost/nhost-js";

const NhostContext = React.createContext<NhostClient | null>(null);

export default NhostContext;
