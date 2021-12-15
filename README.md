# subdata

`subdata` is a command line tool for generating fake data for the `substrate-based` chain


# Installation

```shell
npm i -g subdata
```

# Options

The following options are supported by the generate script.

| Option        | Description                |Required            | Default      |
| ------------- |----------------------------|:------------------:|--------------|
| --config      | Path to config file.       | Yes                | by your input|
| --format      | config file format         | No                 | json only now|
| --types       | custom chain type file     | No                 | by your input|

## Usage

```shell
Usage: subdata [options]

Options:
  -V, --version          output the version number
  -c, --config <config>  Path to config file.
  -f, --format <format>  config file format [default: json]
  -t, --types <types>    custom datatype from chain
  -h, --help             display help for command
```

## Requirements

generate data uses a [utility.batch](https://github.com/paritytech/substrate/tree/master/frame/utility) method to speed
up.To use this tool, you must add the utility pallet to your chain

- [utility](https://github.com/paritytech/substrate/tree/master/frame/utility)

## DataType

The application utilizes [Chance.js](http://chancejs.com/), so any data type supported by Chance.js is supported by
subdata.

### custom datatype

You can customize the data type at `meta.datatype`, the format is: `type-array`, such as the following:

```shell
{
  "meta": {
    "datatype": {
      "website": [
        "google.com",
        "github.com"
      ]
    }
  }
}
```

## Example

```shell
subdata -c configs/substrate.json
```


