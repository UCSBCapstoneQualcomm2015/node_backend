##NOTE: python doesnt support private members, 
#       so following convention, any var/func name with leading undersore
#       is to be treated as private.



#######################################
##                                   ##
##          RFID TAG CLASS           ##
##                                   ##
#######################################
import datetime


class Rfid_tag:
	
#######################################
##            constructor            ##
#######################################
	def __init__(self, id, num_snaps, xCoord, yCoord):
		
		self.id = id ##should be const

		##all vars init to 0, use init function to initialize properly, or setters 
		self.snaps = [-1] * num_snaps
		self.xCoord = xCoord
		self.yCoord = yCoord

#######################################
##            initialize             ##
##     so constructor can be empty   ##
#######################################
	# def initialize(self, dA, dB, dC, dD ):
	# 	if (dA.strip() != "" and dA.strip() != "0"):
	# 		self._dist_A = int(dA)
	# 	if (dB.strip() != "" and dB.strip() != "0"):
	# 		self._dist_B = int(dB)
	# 	if (dC.strip() != "" and dC.strip() != "0"):
	# 		self._dist_C = int(dC)
	# 	if (dD.strip() != "" and dD.strip() != "0"):
	# 		self._dist_D = int(dD)
	# 	## if its being set, its the last time it was moved
	# 	self._lastMoved = datetime.datetime.now()


#######################################
##   GETTERS  ##
#######################################
	def getDistances(self):
		return self.snaps

	def getXCoord(self):
		return self.xCoord

	def getYCoord(self):
		return self.yCoord

	def getID(self):
		## [TODO]: write the location algorithm here
		return self.id

	
# 	def getDistances(self):
# 		distances = [ self._dist_A, self._dist_B, self._dist_C, self._dist_D ]
# 		return distances

# 	def getDist_A(self):
# 		## [TODO]: write the location algorithm here
# 		return self._dist_A

# 	def getDist_B(self):
# 		## [TODO]: write the location algorithm here
# 		return self._dist_B

# 	def getDist_C(self):
# 		## [TODO]: write the location algorithm here
# 		return self._dist_C

# 	def getDist_D(self):
# 		## [TODO]: write the location algorithm here
# 		return self._dist_D

# #######################################
# ##   SETTERS FOR SNIFFER DISTANCES    #
# #######################################

# 	def setDist_A(self, dA):
# 		## [TODO]: write the location algorithm here
# 		self._dist_A = dA

# 	def setDist_B(self, dB):
# 		## [TODO]: write the location algorithm here
# 		self._dist_B = dB

# 	def setDist_C(self, dC):
# 		## [TODO]: write the location algorithm here
# 		self._dist_C = dC

# 	def setDist_D(self, dD):
# 		## [TODO]: write the location algorithm here
# 		self._dist_D = dD


# #######################################
# ##             ID getter             ##
# #######################################


##end_class