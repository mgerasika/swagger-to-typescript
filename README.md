## Find all interfaces into project directory and return information about it.

### Example Interface

```
interface IUser {
	firstName: string;
	isActive: boolean;
}
```

### Usage example

```
getInterfaceInfo({ dir: ['./src'] }).then((res) => {
    console.log(JSON.stringify(res.interfaces, null, 2));
});
```

### Response

```
[...
	{
		"name": "IUserDto",
		"type": "interface",
		"path": "./src/model/user.dto.ts",
		"properties": [
			{
				"name": "firstName",
				"type": "string"
			},
			{
				"name": "isActive",
				"type": "boolean"
			}
		]
	},
...
]
```
