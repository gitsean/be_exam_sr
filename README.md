# How To

1. Clone the repository and navigate to the directory.
2. `npm install`
3. `npm start`
4. You will be prompted to input the names of each of three folders:

- Input
- Output
- Error
  These will default to named folders input, output, and error if you do not provide input at the prompts.

5. Move a valid CSV file to the input folder in the 'dist' directory.
6. A JSON file will be created the provided output folder.
7. Any errors will be described in the error folder in a CSV file by the same name.

## Assumptions

We are assuming that the file has the following headers as the first row:

INTERNAL_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE_NUM

A line that is too long or too short will cause an error and will be noted in the error file by the same name in the error directory.
