### Import libraries

from datetime import datetime, timedelta
import random, calendar

### Establish random timestamp - using 'datetime' library SUCKED so we're doing it live here

time_strt_hrs = random.randint(0, 24)
time_strt_min = random.randint(0, 59)
time_strt_sec = random.randint(0, 59)

time_strt_string = f"{time_strt_hrs}:{time_strt_min}:{time_strt_sec}"
time_start = datetime.strptime(time_strt_string, "%H:%M:%S")
timestamps = []

### generates a block of time messages can occur in. If more stamps are needed for larger collections, increase the range
### Timedelta does this cool thing where it acts as an accumulator, but for time.

for i in range(1, 59):
    time = time_start + timedelta(minutes=i, seconds=random.randint(0, 60))
    # random    time = time.strftime("%H:%M:%S")
    timestamps.append(time.strftime("%H:%M:%S"))

###
### Database of User Handles - ideally this is a database that is pulled from OR it's a generator of cool names
### But the generator is a bigger project and this was just a quick and dirty program

handles = [
    "GhostBreaker",
    "virusL0ck",
    "ph@tom-X",
    "null.echo",
    "Glitch3d",
    "r00t-bear",
    "heXkat",
]
used_handles = []

### Data is the text entries, separated by numbers and a period. Program looks for this
### in order to separate the number from the entry. Number is used in assigning who wrote the entry from the handles database
### If number already used, reply will reuse THAT handle
### This can be simplified by having a webform for both handle (if not generated) and text if it's only the formatting
### thats important

data = """
1. So who would have thought the former Governor Marilyn Schultz would have made it out of the arcology? Apparently, she did, and wants her job back !!!
2. Her ex-deputy, now Governor, Ivar J Lindstrom is determined to fight to keep hold of his seat.
3. Former Governor Schultz's legal team tried to get her position reinstated by Supreme High Court. Justice Williams has ruled that the only way to deal with the situation is to allow former Governor Schultz to enter into this year's Governor Elections.
2. Lindstrom must have been jumping for joy at this as up until now its been pretty much a only horse race as Lindstrom gained a lot of support for his handling of the Renraku Arcology Shutdown, but now with Schultz back his voting base is evenly split between the two, which also brings the other candidates into range of an actual win.
3. One of Schultz's strongest and more popular electoral promises is to "Ensure that a crisis such as the Arcology Shutdown never happens again".
4. She intends to do this by working with the Corporate Court to monitor Mega Corp's in Seattle more closely.
1. The Mega Corp's will let this happen over their dead share holders bodies...except maybe Ares Macrotechnology.
"""

### Randomized data stamp. Didn't know what range Shadowrun 2e was so made it broad. Adjust accordingly.

month = calendar.month_name[random.randint(1, 12)]
day = random.randint(1, 28)
year = random.randint(2050, 2060)


### Separates data into individual entries
sep_lines = data.splitlines()

### Shuffles handles to create a new "deck" to draw from. Order of 'deck' correspond to index of numbered text entry

random.shuffle(handles)
for idx, line in enumerate(sep_lines):
    if line != "":
        breakdown = line.split(". ")
        user_num = int(breakdown[0]) - 1
        text = breakdown[1]
        word_count = len(text.split())
        type_speed = word_count / 60

        for handle in handles:
            user = handles[user_num]

        timestamp = timestamps[idx]

        ### This formats everything together for the entry

        print(f">>>>[{text}]<<<<")
        print(f"—— {user} [{timestamp} (UTC)  {month} {day}, {year}]\n")