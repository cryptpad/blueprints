import argparse
import json
import os
from collections import defaultdict
from typing import Dict, List, Union

import matplotlib as mpl
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

mpl.style.use("seaborn-v0_8")

mpl.use("pgf")
mpl.rcParams.update(
    {
        "pgf.texsystem": "pdflatex",
        "font.family": "monospace",
        "font.monospace": ["IBM Plex Mono"],
        # XXX: mathtext.* don’t seem to have any effects
        "mathtext.fontset": "custom",
        "mathtext.rm": "IBM Plex Mono",
        "mathtext.it": "IBM Plex Mono:italic",
        "mathtext.bf": "IBM Plex Mono:bold",
        "text.usetex": True,
        "pgf.rcfonts": False,
        "figure.titlesize": 20,
        "ytick.labelsize": 12,
        "xtick.labelsize": 12,
        "axes.labelsize":  16,
        "legend.fontsize":  18,
    }
)

colors = [
    "#e60049",
    "#0bb4ff",
    "#50e991",
    "#e6d800",
    "#9b19f5",
    "#ffa300",
    "#dc0ab4",
    "#b3d4ff",
    "#00bfa0",
]

DATA_PATH = "data"
FIG, AX = plt.subplots(ncols=3, nrows=5, layout="constrained")


BROWSER2IDX = {"firefox": 0, "chromium": 1, "webkit": 2}
FUNC2IDX = {"tSymEnc": 0, "tSymDec": 1, "tSign": 2, "tVerify": 3, "tHash": 4}
IDX2BROWSER = {v: k for k, v in BROWSER2IDX.items()}
IDX2FUNC = {v: "$" + k.replace("t", "t_{") + "}$" for k, v in FUNC2IDX.items()}


def read_data(file: str) -> dict:
    with open(file=file, mode="r", encoding="utf-8") as json_file:
        data = json.load(json_file)

    parsed_data = {}

    for msg_size, measurements in data.items():
        parsed_data[int(msg_size)] = measurements

    return parsed_data


def plot_for_function(
    msg_sizes: List[int],
    measurements: Dict[str, List[float]],
    func_name: str,
    browser: str,
    suite2color,
):

    i_browser = BROWSER2IDX[browser]
    i_func = FUNC2IDX[func_name]

    ax = AX[i_func][i_browser]

    for suite, results in measurements.items():
        ax.plot(
            [x / 10**6 for x in msg_sizes],
            results,
            label=suite,
            color=suite2color[suite],
            marker="o",
            markersize=4,
            linewidth=1,
            clip_on=False,
        )
        # ax.legend()


def plot_for_browser(browser: str, timestamp: str):
    data = read_data(file=f"{DATA_PATH}/{timestamp}_{browser}.json")
    msg_sizes = list(data.keys())

    ciphersuites = set()

    for suites in list(data[msg_sizes[0]].values()):
        ciphersuites.update(suites)

    measurements = defaultdict(lambda: defaultdict(list))

    suite2name = {
        "NaClCipher": "TweetNaCl-JS",
        "SodiumCipher": "Libsodium.js",
        "AESGCMCipher": "Web Crypto API",
        # "AESCBCCipher": "SC (AES-CBC)",
        # "RSASSACipher": "SC (RSA-SSA)",
        "RSAPSSCipher": "Web Crypto API",
        # "ECDSACipher": "SC (ECDSA)",
        "SHA512Cipher": "Web Crypto API",
    }

    suite2color = {}

    for name, color in zip(suite2name.values(), colors):
        if name in suite2color:
            continue
        suite2color[name] = color

    for cipher_suite in suite2name:
        for msg_size in data:
            for func, results in data[msg_size].items():

                if cipher_suite in results:
                    measurements[func][suite2name[cipher_suite]].append(
                        results[cipher_suite]
                    )

    for func in measurements:
        plot_for_function(
            msg_sizes=msg_sizes,
            measurements=measurements[func],
            func_name=func,
            browser=browser,
            suite2color=suite2color,
        )
    FIG.legend(
        handles=[
            mpatches.Patch(color=color, label=suite)
            for suite, color in suite2color.items()
        ],
        loc="lower center",
        ncols=len(suite2color),
        bbox_to_anchor=(0.5, -0.07),
    )


def plot_all(timestamp: str) -> None:
    for browser in ["chromium", "firefox", "webkit"]:
        plot_for_browser(browser=browser, timestamp=timestamp)

    for axes in AX:
        y_max = 0

        for ax in axes:
            y_max = max(y_max, ax.get_ylim()[1])

        for ax in axes:
            ax.set_ylim(ymax=y_max)

    for i in range(len(AX)):
        for j in range(len(AX[i])):
            if j == 0:  # First column
                AX[i][j].set_ylabel(f"{IDX2FUNC[i]}\n(ms)")
            else:
                AX[i][j].tick_params(labelleft=False)

            if i == len(AX) - 1:  # Last row
                AX[i][j].set_xlabel("Size (MB)")
            else:
                AX[i][j].tick_params(labelbottom=False)

            if i == 0:
                AX[i][j].set_title(IDX2BROWSER[j].capitalize())
                # XXX: for some reasons, I cannot find this parameter in rcParams…
                AX[i][j].title.set_size(18)
    FIG.suptitle("Performance of Different Crypto Libraries on Various Browsers")

    # Plot generation for the PDF File
    width = 4.983
    height = width * 3 / 4
    FIG.set_size_inches(width, height)
    # FIG.tight_layout()
    plt.savefig("performance.pgf", bbox_inches="tight")

    # Plot generation for the website
    width = 10
    height = width * 3 / 4
    FIG.set_size_inches(width, height)
    plt.savefig("performance.svg", bbox_inches="tight")


def main(timestamp: Union[str, None]):
    if timestamp is None:
        # find latest
        files = sorted(os.listdir(DATA_PATH))
        latest_file = files[-1]
        timestamp = latest_file[: latest_file.rfind("_")]

    plot_all(timestamp=timestamp)


# Create the parser and add arguments
parser = argparse.ArgumentParser()
parser.add_argument(
    "--timestamp",
    help="The timestamp of the data to be plotted.",
    required=False,
)

# Parse and print the results
args = parser.parse_args()
main(args.timestamp)
