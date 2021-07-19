## Add migration
dotnet ef migrations add UserPasswordAdded

## Update db
dotnet ef database update

## Reset db
dotnet ef database drop
dotnet ef database update
