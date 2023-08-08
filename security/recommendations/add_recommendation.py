import sys


def main(title: str):
    folder = "improvements/"
    file = title.lower().replace(" ", "_") + ".tex"

    section = r"\subsection{" + title + r"}"
    content = (
        section
        + r"""

\paragraph{Problem:}

\paragraph{Consequences:}

\paragraph{Suggestions:}

\paragraph{Drawbacks:}
"""
    )
    with open(file=folder + file, encoding="utf-8", mode="w") as tex_file:
        tex_file.write(content)

    with open(file="main.tex", encoding="utf-8", mode="a") as main_file:
        main_file.write(r"\input{" + folder + file + r"}" + "\n")

    return


if __name__ == "__main__":
    main(sys.argv[1])
