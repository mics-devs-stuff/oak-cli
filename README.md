# Oak CLI

Oak is a configurable Node CLI application that helps you build CLI commands based on your project configuration (tree).

## Getting Started

To get started with Oak, you'll need to initialize the configuration file using the `init` command.

## Installation

```bash
npm i oak-cli
npm link
```
This will let you use the oak command. note that anytime you're gonna to make a `npm i` you need to make another `npm link`.

### Initialize Configuration File

Run the following command to create a new `oak.config.js` file in your current working directory:
```bash
oak init
```
### What to Expect

After running the `init` command, you should see a new `oak.config.js` file in your current working directory. This file contains the default configuration settings for Oak.

### Verify the Installation

To verify that Oak has been installed correctly, run the following command:
```bash
oak v
```
This should display the version of Oak that you just installed + the packages.

## Commands

### Init

Initializes the Oak configuration file.

```bash
oak init
```

### Version

Shows the Oak version and some extra information.

```bash
oak v
```

### Help

Shows the available commands.

```bash
oak help
```

### Validate

Validates the `oak.config.js` file.

```bash
oak validate
```

## Arguments

### --doc (-d)

Opens the documentation of a specific topic.

```bash
oak --doc <topic>
```

### --endless (-e)

Runs Oak endlessly until the user stops it.

```bash
oak --endless
```

## Prompts

Oak uses the following prompts to provide feedback to the user:

* **Error**: `ERROR!` (color: `#E07A5F`)
* **Success**: `DONE!` (color: `#81B29A`)
* **Warning**: `WARNING!` (color: `#F2CC8F`)
* **Info**: `INFO!` (color: `#81B5D9`)
* **Info2**: `INFO!` (color: `#C087BD`)
* **Validation**: `OAK CONFIG VALIDATION`

## Documentation

You can access the Oak documentation using the `--doc` argument. Currently, the following topics are available:

* [Oak](https://example.com/oak-docs)
* [Config](https://example.com/config-docs)

## License

Oak is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to contribute to Oak.


## Issues

If you encounter any issues or have questions, please open an issue on GitHub.

## Changelog

See the [CHANGELOG](CHANGELOG.md) for a list of changes.

## Code of Conduct

Oak adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## Contact

If you have any questions or need help, please contact us at [michelangelobasso.dev@gmail.com](mailto:michelangelobasso.dev@gmail.com).
