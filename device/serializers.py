from rest_framework import serializers
from .models import Device

class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device 
        fields = ('pk', 'img_name', 'mgt_intf', 'mgt_ip', 'hwsku', 'mac', 'platform', 'type')
