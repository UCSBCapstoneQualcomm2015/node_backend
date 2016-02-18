import hashlib
import sys
import json

def md5hash(itemName):
	encode = hashlib.md5(itemName).hexdigest()
	return encode



if __name__=="__main__":
	try:
		# itemName = sys.argv[1]
		# print md5hash(itemName)
		refTags = json.loads(sys.argv[1])
		print refTags
	except Exception, e:
		print e
		print "Error: Please supply item name to be hashed."
		sys.exit(1)



#"{"snaps": [{"sig_strength": [30.433791721759818, 28.692317197309762, 30.733517023869009, 32.263420871636306, 22.92256071356476, 28.325089127062363, 24.082399653118497], "ids": ["230000000000", "220000000000", "430000000000", "320000000000", "510000000000", "410000000000", "520000000000"]}]}" 110000000000 "{"tags" : [230000000000, 220000000000, 430000000000, 320000000000, 510000000000, 410000000000, 520000000000]}"