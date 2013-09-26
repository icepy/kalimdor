#前端自动化工具（功能）@代表，已经实现的功能

#	@部署环境，合并文件。
#	未来增加：部署环境，压缩。	

import string
import sys
import os
import libs.config

#文件信息
x = libs.config.file_config
folder = os.getcwd()
folder_config = os.path.dirname(libs.config.__file__)
folder_path = folder_config + '/newfile'
if not os.path.exists(folder_path):
	os.mkdir(folder_path)
	pass

#压缩文件字段名
compression = ('.css','.js')

#合并函数
def gruntFile(x):
	y = {}
	_newFile = {}
	for _keys,_value in x.items():
		suffix = _keys
		for _key,_val in _value.items():
			y[_key] = []
			_path = folder_path+'/'+_key
			if not os.path.exists(_path):
				os.mkdir(_path)
				pass
			_newFile[_key] = open(_path + '/'+_key + suffix,'w',encoding = 'utf-8')
			for _file in _val:
				print('合并的文件：'+_file)
				_open = open(_file,'r',encoding='utf-8');
				_content = _open.read()
				y[_key].append(_content) 
				_open.close()
				pass
			pass
	print('')
	for _k,_v in y.items():
		_f = _newFile[_k]
		for _Content in _v:
			_f.write(_Content)
			pass
		print('文件合并完成之后的目录：'+folder_path+'/'+_k)
		_f.close()
		pass
	pass
gruntFile(x)