const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
    .default
const styledComponentsTransformer = createStyledComponentsTransformer()

module.exports = {
    entry: {
        app: "./src/app.tsx",
        scanner: "./src/scanner.ts",
    },
    output: {
        filename: "[name].js",
    },
    target: "electron-renderer",
    externals: {
        chokidar: "chokidar",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            getCustomTransformers: () => ({
                                before: [styledComponentsTransformer],
                            }),
                        },
                    },
                ],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader",
            },
        ],
    },
}
