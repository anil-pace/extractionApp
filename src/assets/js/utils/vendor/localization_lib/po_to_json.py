#!/usr/bin/python
#
# convert .po to .json
#

import json
import optparse
import os
import polib
import re
import string
import sys

parser = optparse.OptionParser(usage="usage: %prog [options] pofile...")
parser.add_option("--quiet", action="store_false", default=True, dest="verbose", help="don't print status messages to stdout")

(options, args) = parser.parse_args()

if args == None or len(args) == 0:
	print("ERROR: you must specify at least one po file to translate");
	sys.exit(1)

paramFix = re.compile("(\\(([0-9])\\))")

for srcfile in args:

	destfile = os.path.splitext(srcfile)[0] + ".json"
	if options.verbose:
		print("INFO: converting %s to %s" % (srcfile, destfile))
	
	xlate_map = {}
	
	po = polib.pofile(srcfile, autodetect_encoding=False, encoding="utf-8", wrapwidth=-1)
	po2 = polib.pofile(srcfile, autodetect_encoding=False, encoding="utf-8", wrapwidth=-1)
	duplicateEntries = [];
	for entry in po:
		if entry.obsolete  or entry.msgstr == entry.msgid:
			continue;
		count = 0;
		for entry1 in po2:			
			if entry1.msgid == entry.msgid:
				count = count + 1;
				if count > 1:
					count = 0;
					print("Duplicate found: %s" % entry1.msgid)
					duplicateEntries.append(entry.msgid);
		xlate_map[entry.msgid] = entry.msgstr;
	if len(duplicateEntries)> 1:
		for entry in duplicateEntries:			
			print("Total number of duplicate entries %d" %len(duplicateEntries));
			break;

	dest = open(destfile, "w")
	print("No duplicate entries found");
	print("Writing to the JSON now");
	dest.write(json.dumps(xlate_map, sort_keys = True));
	
	dest.close()