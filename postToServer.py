import httplib, urllib
import time
import sys
#Braulio
#conn = httplib.HTTPConnection('169.231.102.16',3000)

#This
conn = httplib.HTTPConnection('localhost',3000)

#
#conn = httplib.HTTPConnection('98.182.19.115',3000)

#Add User
params = urllib.urlencode({'email': 'porter614@gmail.com', 'password': 'viclp994'})

#Add RFID_Tag
params2 = urllib.urlencode({'tagId': '898989', 'userId': '5644d33480cfd724288becd1', 'name' : 'BackPack'})


headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain" }

conn.request("POST", "/login", params, headers)
response = conn.getresponse()
data = response.read()


print response.getheaders()
print response
cookie = response.getheader('Set-Cookie')

headers['cookie'] = cookie

print data
time.sleep(2)

conn.request("POST", "/rfidtags/new_tag_form", params2, headers)

#conn.request("GET", "/login", headers)

response = conn.getresponse()
data = response.read()

print data
time.sleep(2)


sys.exit()


'''
conn.request("GET", "/rooms", params2, headers)

response = conn.getresponse()
data = response.read()
conn.close()

print data
time.sleep(2)
'''