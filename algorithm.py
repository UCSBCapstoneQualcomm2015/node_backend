import json
import csv
import sys
import yaml
import math
from heapq import nsmallest


import collections
from collections import defaultdict

from rfid_class import *

sample1 = '{"snaps": [{"snap1" : [{"ids": ["a", "b"]}, {"sig_strength" : ["1", "2"]}]}]}'
sample2 = '{"cars": {"Nissan": [{"model":"Sentra", "doors":4},{"model":"Maxima", "doors":4}],"Ford": [{"model":"Taurus", "doors":4},{"model":"Escort", "doors":4}]}}'
sample3 = '{"snaps": [{"name": "snap1", "ids":["1", "4", "3","2"], "sig_strength":[23, 25, 24, 28]}, {"name": "snap2", "ids":["2", "1", "0"], "sig_strength":[21, 28,15]}, {"name": "snap3", "ids":["5", "2", "3","4"], "sig_strength":[21, 29,23,22]}]}'
sample4 = '{"snaps": [{"sig_strength": [27.867514221455615, 29.694119124784834, 24.082399653118497, 26.702458530741243, 27.3559889969818, 26.020599913279625, 27.172844520170994], "ids": ["230000000000", "310000000000", "220000000000", "430000000000", "320000000000", "410000000000", "520000000000"]},{"sig_strength": [30.159061356651854, 28.597385661971472, 29.405164849325672, 30.637959859789461, 32.263420871636306, 25.514499979728754, 28.325089127062363, 26.020599913279625, 25.31478917042255], "ids": ["230000000000", "310000000000", "220000000000", "430000000000", "320000000000", "510000000000", "410000000000", "520000000000", "110000000000"]},{"sig_strength": [22.04119982655925, 28.061799739838872, 30.253058652647702, 24.653828514484182, 25.31478917042255], "ids": ["220000000000", "520000000000", "510000000000", "430000000000", "410000000000"]},{"sig_strength": [26.020599913279625, 25.334237554869496, 21.871908490254413, 22.92256071356476, 25.31478917042255, 31.335389083702175], "ids": ["230000000000", "120000000000", "220000000000", "430000000000", "320000000000", "110000000000"]}]}' 

vic_sample1 = '{"snaps": [{"sig_strength": [30.810311590506647, 27.3559889969818, 29.151891030953777, 30.58945731389656, 32.263420871636306, 25.211696022817751, 28.964982392847119, 25.051499783199059], "ids": ["230000000000", "310000000000", "220000000000", "430000000000", "320000000000", "520000000000", "410000000000", "110000000000"]},{"sig_strength": [26.848453616444125, 29.912260756924951, 24.149733479708178, 27.456248016875179, 26.855708892230908, 27.3559889969818, 23.010299956639813], "ids": ["230000000000", "310000000000", "220000000000", "430000000000", "320000000000", "520000000000", "110000000000"]},{"sig_strength": [26.989700043360187, 25.282999881463908, 30.644579892269185, 25.158738437116792], "ids": ["230000000000", "120000000000", "110000000000", "320000000000"]},{"sig_strength": [28.061799739838872, 29.700589333738591, 23.332589902774405, 25.888317255942074], "ids": ["520000000000", "510000000000", "310000000000", "410000000000"]}]}'
vic_id =  '230000000000'
vic_tags = '{"tags" : ["120000000000","220000000000","320000000000","310000000000","410000000000","430000000000","510000000000","520000000000"]}'

# failed to launch algorithm 1. snapdragon doesn't respond 2. 

# id: "1"
# distances: [23, 28, -1]
def test(input):
	myStr =  json.loads(input)
	for snaps in myStr['snaps']:
		print snaps['name']

def delete_blanks(input, itemId):
	myStr = yaml.load(input)
	tags = []
	index = 0
	# valid sniffers: go through list of sniffers and if id we are looking for is not contained, delete that sniffer
	for snap in myStr['snaps']:
		if (itemId not in snap['ids']):
			del myStr['snaps'][index]
		else:
			index = index + 1
	return myStr

#tag initialized to correct number of sniffers (sig strength of -1) and store in array
def initialize_tag_objects(tagArray, num_snaps):
	tags = []
	for tag in tagArray:
		tagId = str(tag['id'])
		xCoord =float(tag['xCoord'])
		yCoord = float(tag['yCoord'])
		tags.append(Rfid_tag(tagId, num_snaps, xCoord, yCoord))
	return tags

#returns item object
def initialize_item(itemId, num_snaps):
	itemId = str(itemId)

	return Rfid_tag(itemId, num_snaps, -1, -1)

def populate_item(tag, jsonString):
	for i in range(len(tag.snaps)):
		currentSnap = jsonString['snaps'][i]
		if (currentSnap['ids'].count(tag.getID()) == 1): 		#SNAPDRAGON LOCATED THIS TAG
			tag.snaps[i] = currentSnap['sig_strength'][currentSnap['ids'].index(tag.getID())]

	return tag

#CAN BE USED FOR REFERENCE TAG OR ITEM: param: ref/item object, json; return = correctly filled in object 
def populate_tag(tag, jsonString, snap_distances):
	#if a specific value doesn't exist, keep the -1
	#[-1, -1, -1, -1]
	for i in range(len(tag.snaps)):
		currentSnap = jsonString['snaps'][i]
		if (currentSnap['ids'].count(tag.getID()) == 1): 		#SNAPDRAGON LOCATED THIS TAG
			tag.snaps[i] = currentSnap['sig_strength'][currentSnap['ids'].index(tag.getID())]
		else:
			#calculate tag distance from snapdragon
			dist_to_match = get_distance_class(currentSnap, tag)
			#lambda function to get key of closest tag
			# closestTag =  min(snap_distances[i].keys(), key=lambda x:abs(snap_distances[i][x]-float(dist_to_match)))
			two_closest_tags = nsmallest(2, snap_distances[i].keys(), key=lambda x: abs(snap_distances[i][x]-float(dist_to_match)))

			#set it exactly as closest value's RSSI:
			#tag.snaps[i] = currentSnap['sig_strength'][currentSnap['ids'].index(closestTag)]
			# print currentSnap['sig_strength'][currentSnap['ids'].index(two_closest_tags[1])]
			# print currentSnap['sig_strength'][currentSnap['ids'].index(two_closest_tags[0])]
			# print snap_distances[i][two_closest_tags[1]]
			# print snap_distances[i][two_closest_tags[0]]
			# print ""
			if float(snap_distances[i][two_closest_tags[1]] - snap_distances[i][two_closest_tags[0]]) == 0:
				slope = 0
			else:
				slope = (currentSnap['sig_strength'][currentSnap['ids'].index(two_closest_tags[1])] - currentSnap['sig_strength'][currentSnap['ids'].index(two_closest_tags[0])]) / float(snap_distances[i][two_closest_tags[1]] - snap_distances[i][two_closest_tags[0]])
			
			b = currentSnap['sig_strength'][currentSnap['ids'].index(two_closest_tags[0])] - (slope * snap_distances[i][two_closest_tags[0]])
			tag.snaps[i] = (slope * dist_to_match) + b
			#set it according to slope

	# print tag.getDistances()
	# print " "
	return tag

def get_distance_class(snapdragon, tag):
	# return 1
	return math.sqrt((float(tag.getXCoord()) - float(snapdragon['xCoord']))**2 + (float(tag.getYCoord()) - float(snapdragon['yCoord']))**2)



##Should return sqrt(Rfid_tags) tags with distance closest to missing tag
def nClosest(nSniffers, rfidList, missingID): ##make nSnif = 4 as default 
	
	##assumed: all rfids have locations populated
	##floor of sqrt (number of sniffer) is what should be left
	returnable = int ( len(rfidList) ** (.5) )

	missingDist = missingID.getDistances()
	sniffer_proximity_lists = defaultdict()



	for i in range( 0, nSniffers ): ##each sniffer gets a list of rfid tags
		sniffer_proximity_lists[i] = []
		# sniffer_proximity_lists[i] = deepcopy(rfidList)
		# print sniffer_proximity_lists[i]
		for j, tag in enumerate( rfidList ): ## for each rfid 
			# sniffer_proximity_lists[i].append( tag.getDistances()[i] ) ## get respective tag for each 
			if not tag.getDistances()[i] == -1: 
				sniffer_proximity_lists[i].append( tag ) ## get respective tag for each 


		## sort the list
	for i, _sniffer_ in enumerate(sniffer_proximity_lists):
		# sniffer_proximity_lists[_sniffer_] = sorted( sniffer_proximity_lists[_sniffer_], key = lambda x: x.getDistances()[i] ,reverse = True )
		sniffer_proximity_lists[_sniffer_].sort( key = lambda x: abs(x.getDistances()[i] - missingDist[i]) ,reverse = False )	
		# del sniffer_proximity_lists[_sniffer_][:returnable] ##truncate past sqrt#sniffers
		del sniffer_proximity_lists[_sniffer_][returnable:] ##truncate past sqrt#sniffers

	return sniffer_proximity_lists


def compareLists(list1, list2, matches):
## NOTE: whatever calls this, must take the returned dictionary and append its changes to the main one.
	if (len(list1) != len(list2)):
		raise ValueError('The two lists have different lengths.')

	settit = set() ## for efficient use of "in"
	for rfid in list1:
		settit.add( rfid.getID())

	for rfid in list2: 
		if rfid.getID() in settit: ## if there is a match
			##add it to the dictionary
			if rfid.getID() in matches:
				matches[rfid.getID()] += 1
			else:
				matches[rfid.getID()] = 1 

	return matches


def oneSnapDragon(rfidList, missingID): 
	minId = -1
	missingSS = missingID.getDistances()[0]
	minDiff = 100000
	for rfid in range(0, len(rfidList)):
		# print abs(missingSS - rfidList[rfid].getDistances()[0])
		if (rfidList[rfid].getDistances()[0] != 1):
			if (abs(missingSS - rfidList[rfid].getDistances()[0]) < minDiff):
				minDiff = abs(missingSS - rfidList[rfid].getDistances()[0])
				minId = rfid
	matches = defaultdict()
	matches[rfidList[minId].getID()] = 1
	return matches

def getLocation(matches, tags):
	x = 0
	y = 0
	counter = 0
	for key, value in matches.iteritems():    
		for tag in tags:
			if tag.getID() == key:
				x += (tag.getXCoord() * value)
				y += (tag.getYCoord() * value)
				counter += value
	xCoord = x / float(counter)
	yCoord = y / float(counter)
	resultDict = {'xCoord': xCoord, 'yCoord': yCoord}
	return resultDict 



#for tags in "tags" list as well as snapList, calculate its distance and add it to dict 
#return that dict (key:id, val: dist)
def get_snap_distances(snapdragon, tags):
	snap_dist = defaultdict()
	for tag in tags:
		if tag['id'] in snapdragon['ids']:
			snap_dist[tag['id']] = get_distance(snapdragon, tag)
	return snap_dist


def get_distance(snapdragon, tag):
	# return 1
	return math.sqrt((float(tag['xCoord']) - float(snapdragon['xCoord']))**2 + (float(tag['yCoord']) - float(snapdragon['yCoord']))**2)


		

#[ x ] call delete blanks (number of snapdragons in json should now be the right number that have the ref value in it)
#[ x ]initialize reftags class to have correct number of snapdragons (length of json.snaps) all set to -1
#[ x ]special class for tag we are looking for
#[ x ]iterate through list of tags: (done in main right now)
	#[ x ]put signal for each snapdragon into its class structure  str['snaps'][1]['ids'][str['snaps'][1]['ids'].index('2')]
#[ x ]nClosest: 	find  sqrt(number of ids) closest distances (ran on each snapdragon)

#[ x ]compareLists: check for matches in two different lists

##CASE FOR IF ITEM IS NOT FOUND 
##CASE FOR IF ONLY ONE SNAPDRAGON 

#rfidCLass-> id: ?, sig_strengths= [-1] * snaps.length


#inputs: json, itemId, array of refTagIds
if __name__=="__main__":
	itemId = sys.argv[2]
	snapdragons = delete_blanks(sys.argv[1], itemId)
	refTags = yaml.load(sys.argv[3])['tags']	
	# snapdragons = delete_blanks(vic_sample1, vic_id)
	# del snapdragons['snaps'][0]
	# print len(snapdragons['snaps'])
	tags = initialize_tag_objects(refTags, len(snapdragons['snaps']))
	# tags = initialize_tag_objects(["1","2","3","5"], len(snapdragons['snaps']))

	item = initialize_item(itemId, len(snapdragons['snaps']))


	item = populate_item(item, snapdragons)

	#distance List: array of size (snaps) -> 
	#list of dictionary objects: each dict's size is # of tags found that were in db -> key:id, value: distance
	snap_distances = []
	for i in xrange(len(snapdragons['snaps'])):
		snap_distances.append(get_snap_distances(snapdragons['snaps'][i], refTags))


	for tag in tags:
		# print tag.getID()
		tag = populate_tag(tag, snapdragons, snap_distances)

	if (len(snapdragons['snaps']) > 1):
		closestResults = nClosest(len(snapdragons['snaps']), tags, item)
		matches = defaultdict()
		index = 0
		for k in closestResults.keys():
			if len(closestResults[k]) < int ( len(tags) ** (.5)):
				del closestResults[k]
		# for i in xrange(len(closestResults)):
		# 	for a in xrange(len(closestResults[i])):
		# 		print closestResults[i][a].getID()
		# 	print ""		
		for i in range(0, len(closestResults) - 1):
			for j in range(1, len(closestResults)):
				matches = compareLists(closestResults[i],closestResults[j], matches)

	elif (len(snapdragons['snaps']) == 1):
		matches = oneSnapDragon(tags, item)
	
	else:	#0 snapdragons -> should be handled from node side
		print ":("
	# print matches
	print json.dumps(getLocation(matches, tags))
	
	# print json.dumps(dict(matches))

