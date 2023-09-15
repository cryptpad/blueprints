# Performance Measurements

The scripts in this folder allow to measure the performance of various
cryptographic libraries.

The commented evaluation can be found [here](https://cryptpad.fr/code/#/2/code/view/XrCBEbzwVcL4m+xBH+g2aPqH4jZ6f-C4vg5cBjoRfw0/present/).

## Measure

### Install

```bash
npm install
npx playwright install
```

### Run

To measure the performance of various ciphersuites:

```bash
npm t
```

The results are stored in `data/`.

## Plot

### Install

```bash
poetry install
```

### Run

You can plot the latest measurements contained in `data/` with the following
command:

```bash
poetry run python plot.py
```

You can also specify a timestamp of measurements to be plotted, e.g.:

```bash
poetry run python plot.py --timestamp 2022_12_13_14_51_21
```

