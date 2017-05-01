# node-parser

A simple javascript request log parser!

# Usage

to run the parser just execute the following comand at the project's root folder:

> node parser.js <path_to_log_file>
>> Example: node parser.js log.txt

# Output detail

the parser outputs on the first 3 lines, the top 3 most requested resources followed by the total amount of requests found on the log for the given resource

Example:
>https://google.com.br - 1213

>https://www.yahoo.com - 734

>http://www.gmail.com - 483

The next lines summarize the total amount of requests for each status code responded:

Example:
>200 - 1302

>404 - 2230

>500 - 1544
