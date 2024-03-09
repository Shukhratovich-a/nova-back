import { join } from "path";
import { rgb } from "pdf-lib";

export const logoPath = join("uploads", "assets", "images", "logo.png");

export const interRegularPath = join("uploads", "assets", "fonts", "inter", "400.ttf");
export const interMediumPath = join("uploads", "assets", "fonts", "inter", "500.ttf");
export const interSemiBoldPath = join("uploads", "assets", "fonts", "inter", "600.ttf");
export const interBoldPath = join("uploads", "assets", "fonts", "inter", "700.ttf");

export const colorWhite = rgb(0.9803921568627451, 0.9803921568627451, 0.9803921568627451);
// export const colorBlack = rgb();
export const colorBlue = rgb(0.12941176470588237, 0.4627450980392157, 0.9176470588235294);
